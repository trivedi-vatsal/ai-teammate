const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const core = require("@actions/core");
const { Octokit } = require("@octokit/action");
const {
  createSystemPrompt,
  createOverviewAndChangesPrompt,
  createPromptByDepth,
} = require("./prompts");

async function run() {
  try {
    // Get inputs from action
    const githubToken = core.getInput("github_token", { required: true });
    const endpoint = core.getInput("azure_openai_endpoint", { required: true });
    const apiKey = core.getInput("azure_openai_api_key", { required: true });
    const modelName = core.getInput("azure_openai_model_name", {
      required: true,
    });
    const reviewDepth = core.getInput("review_depth") || "comprehensive";
    const temperature = parseFloat(core.getInput("temperature") || "0.3");

    // Get PR information from GitHub context
    const prNumber = process.env.GITHUB_EVENT_PATH
      ? JSON.parse(
          require("fs").readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")
        ).pull_request.number
      : core.getInput("pr_number");

    const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
    const repoName = process.env.GITHUB_REPOSITORY
      ? process.env.GITHUB_REPOSITORY.split("/")[1]
      : null;

    // Validate required inputs
    if (!endpoint || !apiKey || !modelName) {
      throw new Error(
        "Missing required Azure OpenAI configuration. Please check your azure_openai_endpoint, azure_openai_api_key, and azure_openai_model_name inputs."
      );
    }

    if (!prNumber || !repoOwner || !repoName) {
      throw new Error(
        "Missing required PR information. Ensure this action runs on pull_request events or provide pr_number input."
      );
    }

    console.log("🤖 AI Teammate - Starting PR Review...");
    console.log(`📝 Analyzing PR: #${prNumber}`);
    console.log(`🔗 Repository: ${repoOwner}/${repoName}`);

    // Initialize Azure OpenAI client
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

    // Initialize Octokit for GitHub API calls
    const octokit = new Octokit({
      auth: githubToken,
      log: console,
    });

    // Get PR changes with actual code content
    let changes;
    try {
      const { data: files } = await octokit.rest.pulls.listFiles({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
      });

      // Build detailed changes with actual code content
      const changeDetails = [];
      let totalTokens = 0;
      const maxContextTokens = 20000; // Conservative token limit for context
      let processedFiles = 0;

      for (const file of files) {
        // Process all files in sequence, but monitor token usage
        let fileContent = `\n### File: ${file.filename}\n`;
        fileContent += `**Status:** ${file.status} | **Changes:** +${file.additions} -${file.deletions}\n\n`;

        if (file.patch && file.patch.length < 4000) {
          // Limit patch size to avoid token overflow
          fileContent += "```diff\n" + file.patch + "\n```\n";
        } else if (file.patch) {
          // For large files, show first part of the diff
          fileContent +=
            "```diff\n" +
            file.patch.substring(0, 3000) +
            "\n... (truncated)\n```\n";
        } else {
          fileContent += "*No diff available (likely binary file or rename)*\n";
        }

        // Rough token estimation (4 characters ≈ 1 token)
        const fileTokens = Math.ceil(fileContent.length / 4);

        // Check if adding this file would exceed token limits
        if (totalTokens + fileTokens > maxContextTokens && processedFiles > 0) {
          changeDetails.push(
            `\n*Note: Processed ${processedFiles} of ${files.length} files. Remaining files omitted to stay within token limits.*`
          );
          break;
        }

        changeDetails.push(fileContent);
        totalTokens += fileTokens;
        processedFiles++;
      }

      changes = changeDetails.join("\n");

      console.log(
        `📊 Processed ${processedFiles} of ${files.length} files with detailed diffs`
      );
      console.log(
        `📏 Total context length: ${changes.length} characters (~${totalTokens} tokens)`
      );
    } catch (error) {
      console.error("❌ Failed to fetch PR files:", error.message);
      throw new Error(`Failed to fetch PR files: ${error.message}`);
    }

    // Create overview and changes prompt
    const overviewPrompt = createOverviewAndChangesPrompt(changes);

    // Generate overview and changes message
    console.log("🔍 Generating overview and changes...");
    const overviewResult = await client.getChatCompletions(
      modelName,
      [
        {
          role: "system",
          content: createSystemPrompt(reviewDepth),
        },
        {
          role: "user",
          content: overviewPrompt,
        },
      ],
      {
        temperature: temperature,
      }
    );

    const overviewMessage = overviewResult.choices[0].message.content;

    // Add token usage summary to overview message
    const overviewTokens = overviewResult.usage;
    console.log(
      `📊 Overview API Call - Input: ${overviewTokens.promptTokens}, Output: ${overviewTokens.completionTokens}, Total: ${overviewTokens.totalTokens}`
    );

    const overviewWithTokens =
      overviewMessage +
      `\n\n<details>\n<summary>📊 Token Usage - Overview</summary>\n\n` +
      `**Input Tokens:** ${overviewTokens.promptTokens}\n` +
      `**Output Tokens:** ${overviewTokens.completionTokens}\n` +
      `**Total Tokens:** ${overviewTokens.totalTokens}\n` +
      `**Context Length:** ${changes.length} characters\n\n` +
      `</details>`;

    // Create detailed review prompt
    const reviewPrompt = createPromptByDepth(changes, reviewDepth);

    // Generate detailed review
    console.log("🔍 Generating detailed review...");
    const reviewResult = await client.getChatCompletions(
      modelName,
      [
        {
          role: "system",
          content: createSystemPrompt(reviewDepth),
        },
        {
          role: "user",
          content: reviewPrompt,
        },
      ],
      {
        temperature: temperature,
      }
    );

    const detailedReview = reviewResult.choices[0].message.content;

    // Add token usage summary to detailed review
    const reviewTokens = reviewResult.usage;
    console.log(
      `📊 Review API Call - Input: ${reviewTokens.promptTokens}, Output: ${reviewTokens.completionTokens}, Total: ${reviewTokens.totalTokens}`
    );

    const detailedReviewWithTokens =
      detailedReview +
      `\n\n<details>\n<summary>📊 Token Usage</summary>\n\n` +
      `**Input Tokens:** ${reviewTokens.promptTokens}\n` +
      `**Output Tokens:** ${reviewTokens.completionTokens}\n` +
      `**Total Tokens:** ${reviewTokens.totalTokens}\n` +
      `**Review Depth:** ${reviewDepth}\n\n` +
      `</details>`;

    // Set outputs for GitHub Actions
    core.setOutput("overview", overviewWithTokens);
    core.setOutput("review", detailedReviewWithTokens);

    // Post overview and changes comment first
    try {
      console.log("📝 Posting overview and changes...");
      await octokit.rest.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
        body: overviewWithTokens,
        event: "COMMENT",
      });
    } catch (error) {
      console.error("❌ Failed to post overview:", error.message);
      throw new Error(`Failed to post overview: ${error.message}`);
    }

    // Post detailed review comment second
    try {
      console.log("📝 Posting detailed review...");
      await octokit.rest.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
        body: detailedReviewWithTokens,
        event: "COMMENT",
      });
    } catch (error) {
      console.error("❌ Failed to post detailed review:", error.message);
      throw new Error(`Failed to post detailed review: ${error.message}`);
    }

    console.log("🎉 AI Teammate review completed successfully!");
    console.log("✅ Posted overview and changes message");
    console.log("✅ Posted detailed review comment");
  } catch (error) {
    console.error("❌ Error during AI review:", error.message);
    core.setFailed(`AI review failed: ${error.message}`);
  }
}

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run };
