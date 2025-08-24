const { run } = require("../src/index");
const core = require("@actions/core");
const { Octokit } = require("@octokit/action");

// Mock external dependencies
jest.mock("@actions/core");
jest.mock("@octokit/action");
jest.mock("@azure/openai");

describe("AI Teammate Main Function", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock environment variables
    process.env.GITHUB_REPOSITORY_OWNER = "test-owner";
    process.env.GITHUB_REPOSITORY = "test-owner/test-repo";
    process.env.GITHUB_EVENT_PATH = "/path/to/event.json";

    // Mock fs.readFileSync for event data
    const fs = require("fs");
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        pull_request: { number: 123 },
      })
    );
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.GITHUB_REPOSITORY_OWNER;
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_EVENT_PATH;
  });

  it("should fail when missing required Azure OpenAI configuration", async () => {
    // Mock missing inputs
    core.getInput.mockImplementation((name) => {
      const inputs = {
        azure_openai_endpoint: "",
        azure_openai_api_key: "",
        azure_openai_model_name: "",
        review_depth: "comprehensive",
        temperature: "0.3",
      };
      return inputs[name] || "";
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Missing required Azure OpenAI configuration")
    );
  });

  it("should fail when missing PR information", async () => {
    // Mock inputs with Azure config but no PR info
    core.getInput.mockImplementation((name) => {
      const inputs = {
        azure_openai_endpoint: "https://test.openai.azure.com/",
        azure_openai_api_key: "test-key",
        azure_openai_model_name: "gpt-4",
        review_depth: "comprehensive",
        temperature: "0.3",
      };
      return inputs[name] || "";
    });

    // Clear environment variables to simulate missing PR info
    delete process.env.GITHUB_REPOSITORY_OWNER;
    delete process.env.GITHUB_REPOSITORY;

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Missing required PR information")
    );
  });

  it("should handle valid inputs correctly and create two separate comments", async () => {
    // Mock valid inputs
    core.getInput.mockImplementation((name) => {
      const inputs = {
        azure_openai_endpoint: "https://test.openai.azure.com/",
        azure_openai_api_key: "test-key",
        azure_openai_model_name: "gpt-4",
        review_depth: "comprehensive",
        temperature: "0.3",
      };
      return inputs[name] || "";
    });

    // Mock Azure OpenAI to return different responses for overview and review
    const { OpenAIClient } = require("@azure/openai");
    const mockClient = {
      getChatCompletions: jest.fn()
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Mock overview and changes response" } }],
          usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Mock detailed review response" } }],
          usage: { promptTokens: 200, completionTokens: 100, totalTokens: 300 }
        }),
    };
    OpenAIClient.mockReturnValue(mockClient);

    // Mock Octokit
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: jest.fn().mockResolvedValue({
            data: [
              { filename: "test.js", additions: 5, deletions: 2 },
              { filename: "src/index.js", additions: 10, deletions: 3 },
            ],
          }),
          createReview: jest.fn().mockResolvedValue({}),
        },
      },
    };
    Octokit.mockReturnValue(mockOctokit);

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
    
    // Should make two API calls to OpenAI
    expect(mockClient.getChatCompletions).toHaveBeenCalledTimes(2);
    
    // Should set both overview and review outputs with token usage summaries
    expect(core.setOutput).toHaveBeenCalledWith(
      "overview",
      expect.stringContaining("Mock overview and changes response")
    );
    expect(core.setOutput).toHaveBeenCalledWith(
      "overview",
      expect.stringContaining("📊 Token Usage - Overview")
    );
    expect(core.setOutput).toHaveBeenCalledWith(
      "review",
      expect.stringContaining("Mock detailed review response")
    );
    expect(core.setOutput).toHaveBeenCalledWith(
      "review",
      expect.stringContaining("📊 Token Usage - Detailed Review")
    );
    
    // Should create two separate review comments
    expect(mockOctokit.rest.pulls.createReview).toHaveBeenCalledTimes(2);
    expect(mockOctokit.rest.pulls.createReview).toHaveBeenNthCalledWith(1, {
      owner: "test-owner",
      repo: "test-repo",
      pull_number: 123,
      body: expect.stringContaining("Mock overview and changes response"),
      event: "COMMENT",
    });
    expect(mockOctokit.rest.pulls.createReview).toHaveBeenNthCalledWith(2, {
      owner: "test-owner",
      repo: "test-repo",
      pull_number: 123,
      body: expect.stringContaining("Mock detailed review response"),
      event: "COMMENT",
    });
  });

  it("should handle overview posting failure", async () => {
    // Mock valid inputs
    core.getInput.mockImplementation((name) => {
      const inputs = {
        azure_openai_endpoint: "https://test.openai.azure.com/",
        azure_openai_api_key: "test-key",
        azure_openai_model_name: "gpt-4",
        review_depth: "comprehensive",
        temperature: "0.3",
      };
      return inputs[name] || "";
    });

    // Mock Azure OpenAI
    const { OpenAIClient } = require("@azure/openai");
    const mockClient = {
      getChatCompletions: jest.fn()
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Mock overview response" } }],
          usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Mock review response" } }],
          usage: { promptTokens: 200, completionTokens: 100, totalTokens: 300 }
        }),
    };
    OpenAIClient.mockReturnValue(mockClient);

    // Mock Octokit with failure on first call
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: jest.fn().mockResolvedValue({
            data: [{ filename: "test.js", additions: 5, deletions: 2 }],
          }),
          createReview: jest.fn().mockRejectedValueOnce(new Error("API Error")),
        },
      },
    };
    Octokit.mockReturnValue(mockOctokit);

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Failed to post overview")
    );
  });

  it("should handle detailed review posting failure", async () => {
    // Mock valid inputs
    core.getInput.mockImplementation((name) => {
      const inputs = {
        azure_openai_endpoint: "https://test.openai.azure.com/",
        azure_openai_api_key: "test-key",
        azure_openai_model_name: "gpt-4",
        review_depth: "comprehensive",
        temperature: "0.3",
      };
      return inputs[name] || "";
    });

    // Mock Azure OpenAI
    const { OpenAIClient } = require("@azure/openai");
    const mockClient = {
      getChatCompletions: jest.fn()
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Mock overview response" } }],
          usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 }
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: "Mock review response" } }],
          usage: { promptTokens: 200, completionTokens: 100, totalTokens: 300 }
        }),
    };
    OpenAIClient.mockReturnValue(mockClient);

    // Mock Octokit with success on first call, failure on second
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: jest.fn().mockResolvedValue({
            data: [{ filename: "test.js", additions: 5, deletions: 2 }],
          }),
          createReview: jest.fn()
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce(new Error("API Error")),
        },
      },
    };
    Octokit.mockReturnValue(mockOctokit);

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining("Failed to post detailed review")
    );
  });
});
