# 🤖 AI Teammate - PR Review

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Ready-blue?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-Supported-blue?logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com/en-us/services/openai/)

> **AI-powered pull request reviews that focus purely on code changes**

AI Teammate automatically reviews your pull requests using Azure OpenAI, providing intelligent, constructive feedback based solely on the actual code modifications. No more bias from PR titles or descriptions - just pure code analysis.

## ✨ Features

- **🔍 Pure Code Focus**: Analyzes only the actual code changes, ignoring PR metadata
- **🤖 AI-Powered Reviews**: Uses Azure OpenAI (GPT-4, GPT-3.5-turbo) for intelligent analysis
- **📊 Dual Comment System**: Posts both overview summary and detailed review comments
- **⚡ XML-Structured Prompts**: Optimized for LLM effectiveness and consistent output
- **🎯 Three Review Depths**: Choose between basic, comprehensive, or expert analysis levels
- **� Collapsible Sections**: Uses expandable details for clean, organized feedback
- **📈 Token Usage Tracking**: Displays API usage statistics for cost management
- **🔧 Smart File Processing**: Intelligently handles large files and token limits
- **💬 Automatic Comments**: Posts detailed reviews directly to your PRs
- **🛡️ Comprehensive Coverage**: Reviews code quality, security, maintainability, and potential issues

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
        uses: trivedi-vatsal/ai-teammate@latest
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
          azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
          review_depth: 'comprehensive'
          temperature: '0.3'
```

### 3. That's It! 🎉

AI Teammate will automatically review every new PR and provide intelligent feedback through **two organized comments**:

- **Overview Comment**: Executive summary perfect for stakeholders
- **Detailed Review Comment**: Technical analysis with collapsible sections for developers

## 🆕 What's New

### Enhanced Review System

- **🎯 Dual Comment Structure**: Separate overview and detailed analysis for better organization
- **📱 Collapsible Sections**: Clean, expandable details for improved readability  
- **📊 Token Usage Tracking**: Built-in cost monitoring with detailed API usage statistics
- **🔧 Smart File Processing**: Intelligent handling of large files within token limits
- **⚡ XML-Optimized Prompts**: Structured prompts for better LLM performance and consistency

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
| `review_depth` | Review thoroughness level | `comprehensive` | `basic`, `comprehensive`, `expert` |
| `temperature` | AI creativity level | `0.3` | `0.0` - `1.0` |

### Review Depth Levels

- **`basic`**: Focused, concise reviews highlighting key points only
- **`comprehensive`**: Balanced reviews covering strengths, improvements, and security  
- **`expert`**: Deep technical analysis with architectural insights and performance considerations

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

AI Teammate's enhanced dual-comment system provides:

- **Executive summaries** for stakeholders and project managers  
- **Technical deep-dives** for developers and code reviewers
- **Smart cost management** with built-in token usage tracking
- **Scalable processing** that handles both small fixes and large refactors

**Star this repository** if you find it helpful! ⭐

---
