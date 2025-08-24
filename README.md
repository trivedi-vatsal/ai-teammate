# 🤖 AI Teammate - PR Review

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Ready-blue?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-Supported-blue?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/en-us/services/openai/)

> **AI-powered pull request reviews that focus purely on code changes**

AI Teammate automatically reviews your pull requests using Azure OpenAI, providing intelligent, constructive feedback based solely on the actual code modifications. No more bias from PR titles or descriptions - just pure code analysis.    

## ✨ Features

- **🔍 Pure Code Focus**: Analyzes only the actual code changes, ignoring PR metadata
- **🤖 AI-Powered Reviews**: Uses Azure OpenAI (GPT-4, GPT-3.5-turbo) for intelligent analysis
- **📊 Comprehensive Coverage**: Reviews code quality, security, maintainability, and potential issues
- **⚡ XML-Structured Prompts**: Optimized for LLM effectiveness and consistent output
- **🎯 Configurable Depth**: Choose between basic, comprehensive, or expert review levels
- **🔧 Customizable Parameters**: Adjust tokens, temperature, and review focus
- **💬 Automatic Comments**: Posts detailed reviews directly to your PRs

## 🚀 Quick Start

### 1. Add Repository Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**, then add:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI endpoint URL | `https://your-resource.openai.azure.com/` |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI API key | `your-api-key-here` |
| `AZURE_OPENAI_MODEL_NAME` | Model name | `gpt-4` |

### 2. Create Workflow

Create `.github/workflows/ai-teammate.yml`:

```yaml
name: AI Teammate - PR Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  ai-pr-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: AI PR Review
        uses: trivedi-vatsal/ai-teammate@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
          azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
          review_depth: 'comprehensive'
          max_tokens: '2000'
          temperature: '0.3'
```

### 3. That's It! 🎉

AI Teammate will automatically review every new PR and provide intelligent feedback.

## ⚙️ Configuration

### Required Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `azure_openai_endpoint` | Azure OpenAI endpoint URL | ✅ Yes |
| `azure_openai_api_key` | Azure OpenAI API key | ✅ Yes |
| `azure_openai_model_name` | Model name | ✅ Yes |

### Optional Inputs

| Input | Description | Default | Options |
|-------|-------------|---------|---------|
| `review_depth` | Review thoroughness | `comprehensive` | `basic`, `comprehensive`, `expert` |
| `max_tokens` | Maximum AI response length | `2000` | `1000` - `4000` |
| `temperature` | AI creativity level | `0.3` | `0.0` - `1.0` |

## 📚 Documentation

For detailed documentation, see the [docs](./docs/) directory:

- **[Advanced Configuration](./docs/advanced-configuration.md)** - Custom review depths, prompts, and conditional reviews
- **[Architecture](./docs/architecture.md)** - Technical details, performance, and cost management
- **[Development Guide](./docs/development.md)** - Local development, testing, and contribution guidelines
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and debugging tips
- **[Git Hooks](./docs/git-hooks.md)** - Pre-commit hook documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to revolutionize your code reviews?** 🚀

AI Teammate will help you build better software by providing intelligent, unbiased code analysis on every pull request. Focus on what matters most - the code itself.

**Star this repository** if you find it helpful!
