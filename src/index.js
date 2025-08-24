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
    const maxTokens = parseInt(core.getInput("max_tokens") || "2000");
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

    // Get PR changes
    let changes;
    try {
      const { data: files } = await octokit.rest.pulls.listFiles({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
      });

      changes = files
        .map((f) => `${f.filename} (${f.additions + f.deletions} changes)`)
        .join("\n");
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
        maxTokens: maxTokens,
        temperature: temperature,
      }
    );

    const overviewMessage = overviewResult.choices[0].message.content;

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
        maxTokens: maxTokens,
        temperature: temperature,
      }
    );

    const detailedReview = reviewResult.choices[0].message.content;

    // Set outputs for GitHub Actions
    core.setOutput("overview", overviewMessage);
    core.setOutput("review", detailedReview);

    // Post overview and changes comment first
    try {
      console.log("📝 Posting overview and changes...");
      await octokit.rest.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
        body: overviewMessage,
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
        body: detailedReview,
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
