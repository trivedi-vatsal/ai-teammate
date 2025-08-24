const { run } = require('../src/index');
const core = require('@actions/core');
const { Octokit } = require('@octokit/action');

// Mock external dependencies
jest.mock('@actions/core');
jest.mock('@octokit/action');
jest.mock('@azure/openai');

describe('AI Teammate Main Function', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.GITHUB_REPOSITORY_OWNER = 'test-owner';
    process.env.GITHUB_REPOSITORY = 'test-owner/test-repo';
    process.env.GITHUB_EVENT_PATH = '/path/to/event.json';
    
    // Mock fs.readFileSync for event data
    const fs = require('fs');
    jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
      pull_request: { number: 123 }
    }));
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.GITHUB_REPOSITORY_OWNER;
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_EVENT_PATH;
  });

  it('should fail when missing required Azure OpenAI configuration', async () => {
    // Mock missing inputs
    core.getInput.mockImplementation((name) => {
      const inputs = {
        'azure_openai_endpoint': '',
        'azure_openai_api_key': '',
        'azure_openai_model_name': '',
        'review_depth': 'comprehensive',
        'max_tokens': '2000',
        'temperature': '0.3'
      };
      return inputs[name] || '';
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Missing required Azure OpenAI configuration')
    );
  });

  it('should fail when missing PR information', async () => {
    // Mock inputs with Azure config but no PR info
    core.getInput.mockImplementation((name) => {
      const inputs = {
        'azure_openai_endpoint': 'https://test.openai.azure.com/',
        'azure_openai_api_key': 'test-key',
        'azure_openai_model_name': 'gpt-4',
        'review_depth': 'comprehensive',
        'max_tokens': '2000',
        'temperature': '0.3'
      };
      return inputs[name] || '';
    });

    // Clear environment variables to simulate missing PR info
    delete process.env.GITHUB_REPOSITORY_OWNER;
    delete process.env.GITHUB_REPOSITORY;

    await run();

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Missing required PR information')
    );
  });

  it('should handle valid inputs correctly', async () => {
    // Mock valid inputs
    core.getInput.mockImplementation((name) => {
      const inputs = {
        'azure_openai_endpoint': 'https://test.openai.azure.com/',
        'azure_openai_api_key': 'test-key',
        'azure_openai_model_name': 'gpt-4',
        'review_depth': 'comprehensive',
        'max_tokens': '2000',
        'temperature': '0.3'
      };
      return inputs[name] || '';
    });

    // Mock Azure OpenAI
    const { OpenAIClient } = require('@azure/openai');
    const mockClient = {
      getChatCompletions: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Mock AI review response' } }]
      })
    };
    OpenAIClient.mockReturnValue(mockClient);

    // Mock Octokit
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: jest.fn().mockResolvedValue({
            data: [
              { filename: 'test.js', additions: 5, deletions: 2 },
              { filename: 'src/index.js', additions: 10, deletions: 3 }
            ]
          }),
          createReview: jest.fn().mockResolvedValue({})
        }
      }
    };
    Octokit.mockReturnValue(mockOctokit);

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('review', 'Mock AI review response');
  });
});
