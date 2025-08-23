const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const core = require("@actions/core");
const { Octokit } = require("@octokit/action");
const { createSystemPrompt, createPromptByDepth } = require("./prompts");


async function run() {
  try {
    // Get inputs from action
    const endpoint = core.getInput('azure_openai_endpoint', { required: true });
    const apiKey = core.getInput('azure_openai_api_key', { required: true });
    const modelName = core.getInput('azure_openai_model_name', { required: true });
    const reviewDepth = core.getInput('review_depth') || 'comprehensive';
    const maxTokens = parseInt(core.getInput('max_tokens') || '2000');
    const temperature = parseFloat(core.getInput('temperature') || '0.3');

    // Get PR information from GitHub context
    const prNumber = process.env.GITHUB_EVENT_PATH ? 
      JSON.parse(require('fs').readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')).pull_request.number : 
      core.getInput('pr_number');
    
    const repoOwner = process.env.GITHUB_REPOSITORY_OWNER;
    const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];

    // Validate required inputs
    if (!endpoint || !apiKey || !modelName) {
      throw new Error("Missing required Azure OpenAI configuration");
    }

    if (!prNumber || !repoOwner || !repoName) {
      throw new Error("Missing required PR information");
    }

    console.log("🤖 Starting AI PR Review...");
    console.log(`📝 PR: #${prNumber}`);
    console.log(`🔗 Repository: ${repoOwner}/${repoName}`);
    console.log(`🔍 Review Depth: ${reviewDepth}`);

    // Initialize Azure OpenAI client
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    console.log("✅ Azure OpenAI client initialized");

    // Initialize Octokit for GitHub API calls
    const octokit = new Octokit({
      log: console,
    });
    console.log("✅ Octokit initialized for GitHub API");

    // Get PR changes
    console.log("📊 Fetching PR changes...");
    try {
      const { data: files } = await octokit.rest.pulls.listFiles({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
      });

      const changes = files
        .map((f) => `${f.filename} (${f.additions + f.deletions} changes)`)
        .join("\n");
      console.log(`📁 Found ${files.length} changed files`);
    } catch (error) {
      console.error("❌ Failed to fetch PR files:", error.message);
      throw new Error(`Failed to fetch PR files: ${error.message}`);
    }

    // Create review prompt based on depth
    const prompt = createPromptByDepth(changes, reviewDepth);

    console.log("🤖 Generating AI review...");
    const result = await client.getChatCompletions(
      modelName,
      [
        {
          role: "system",
          content: createSystemPrompt(reviewDepth),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        maxTokens: maxTokens,
        temperature: temperature,
      }
    );

    const review = result.choices[0].message.content;
    console.log("✅ AI review generated successfully");

    // Set output for GitHub Actions
    core.setOutput('review', review);

    // Post review comment
    console.log("💬 Posting review comment...");
    try {
      await octokit.rest.pulls.createReview({
        owner: repoOwner,
        repo: repoName,
        pull_number: parseInt(prNumber),
        body: review,
        event: "COMMENT",
      });

      console.log("✅ Review posted successfully");
    } catch (error) {
      console.error("❌ Failed to post review:", error.message);
      throw new Error(`Failed to post review: ${error.message}`);
    }

    console.log("🎉 AI PR Review completed successfully!");
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
