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

## 🔧 Advanced Usage

### Custom Review Depth

The action supports three review depth levels:

#### Basic Review

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'basic'   # Quick, focused review
    max_tokens: '1500'      # Shorter responses
    temperature: '0.1'      # More focused analysis
```

#### Comprehensive Review (Default)

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'comprehensive'  # Balanced review
    max_tokens: '2000'             # Standard responses
    temperature: '0.3'             # Balanced creativity
```

#### Expert Review

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'expert'   # Deep technical analysis
    max_tokens: '3000'       # Longer, detailed responses
    temperature: '0.1'       # More focused analysis
```

### Customizing Prompts

The action uses XML-structured prompts for optimal LLM effectiveness. You can customize these prompts by modifying the `src/prompts.js` file:

```javascript
// Example: Custom basic review prompt
function createCustomBasicPrompt(changes) {
  return `<review_request>
  <context>Your custom context here</context>
  <files_changed>${changes}</files_changed>
  <review_requirements>
    <requirement id="1">custom_requirement</requirement>
  </review_requirements>
  <instructions>Your custom instructions</instructions>
</review_request>`;
}
```

**Benefits of XML Format:**

- **Clear Structure**: Hierarchical organization of requirements
- **Better Parsing**: LLMs understand structured data better
- **Consistent Output**: More predictable and organized responses
- **Easy Customization**: Clear sections to modify

#### Basic Review

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'basic'   # Quick, focused review
    max_tokens: '1500'      # Shorter responses
    temperature: '0.1'      # More focused analysis
```

#### Comprehensive Review (Default)

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'comprehensive'  # Balanced review
    max_tokens: '2000'             # Standard responses
    temperature: '0.3'             # Balanced creativity
```

#### Expert Review

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'expert'   # Deep technical analysis
    max_tokens: '3000'       # Longer, detailed responses
    temperature: '0.1'       # More focused analysis
```

### Conditional Reviews

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  if: github.event.pull_request.changed_files > 5  # Only review large PRs
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'expert'
```

## 📊 What AI Teammate Reviews

### 🔍 Review Focus Areas

1. **Summary**: What the code changes accomplish
2. **Code Quality**: Best practices and coding standards
3. **Potential Issues**: Bugs, edge cases, and problems
4. **Security**: Vulnerabilities and security considerations
5. **Maintainability**: Code structure and future-proofing
6. **Recommendation**: Overall approval status

### 🎯 Review Philosophy

- **Pure Code Analysis**: Focuses only on actual code modifications
- **Constructive Feedback**: Provides actionable improvement suggestions
- **Security First**: Identifies potential security vulnerabilities
- **Best Practices**: Ensures code follows industry standards
- **Maintainability**: Considers long-term code health

## 🏗️ Architecture

### How It Works

1. **Trigger**: Automatically runs on PR events
2. **Analysis**: Fetches PR changes via GitHub API
3. **AI Review**: Sends structured prompts to Azure OpenAI
4. **Processing**: Analyzes AI response for quality
5. **Output**: Posts detailed review to PR
6. **Feedback**: Provides actionable next steps

### Technical Stack

- **Runtime**: Node.js 20
- **AI Service**: Azure OpenAI (GPT-4, GPT-3.5-turbo)
- **GitHub Integration**: Octokit for API calls
- **Structured Prompts**: XML format for LLM optimization
- **Error Handling**: Comprehensive error management and logging

## 🚨 Troubleshooting

### Common Issues

#### 1. Authentication Errors

```bash
# Verify your Azure OpenAI credentials
# Check endpoint, API key, and model name
```

#### 2. Permission Issues

```yaml
# Ensure workflow has correct permissions
permissions:
  contents: read
  pull-requests: write
```

#### 3. Rate Limiting

```yaml
# Reduce frequency or increase delays
on:
  pull_request:
    types: [opened]  # Only on new PRs
```

### Debug Mode

Enable debug logging by adding to your workflow:

```yaml
- name: Debug Information
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Repository: ${{ github.repository }}"
    echo "PR Number: ${{ github.event.pull_request.number }}"
```

## 🔒 Security & Privacy

### Data Handling

- **Local Processing**: All code analysis happens in GitHub Actions runners
- **No Storage**: No code or data is stored permanently
- **Secure Secrets**: Uses GitHub's encrypted secrets for sensitive data
- **Azure Compliance**: Follows Azure OpenAI data handling policies

### Best Practices

- **Rotate API Keys**: Regularly update your Azure OpenAI API keys
- **Monitor Usage**: Track API usage and costs
- **Access Control**: Use least-privilege access for Azure resources
- **Audit Logs**: Enable logging for security monitoring

## 📈 Performance & Costs

### Optimization Tips

- **Review Depth**: Use `basic` for simple changes, `expert` for complex PRs
- **Token Limits**: Adjust `max_tokens` based on your needs
- **Temperature**: Lower values (0.1-0.3) for focused reviews
- **Selective Triggering**: Only run on relevant PR events

### Cost Management

- **Monitor Usage**: Track Azure OpenAI API consumption
- **Optimize Prompts**: Efficient prompts reduce token usage
- **Batch Reviews**: Consider reviewing multiple PRs together
- **Set Limits**: Use Azure spending limits and alerts

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/trivedi-vatsal/ai-teammate.git
cd ai-teammate

# Install dependencies
npm install

# Build the action
npm run build

# Run tests
npm test
```

## 📚 Resources

- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Octokit Documentation](https://octokit.github.io/rest.js/)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Azure OpenAI** for providing the AI capabilities
- **GitHub** for the Actions platform
- **Octokit** for GitHub API integration
- **Community** for feedback and contributions

---

**Ready to revolutionize your code reviews?** 🚀

AI Teammate will help you build better software by providing intelligent, unbiased code analysis on every pull request. Focus on what matters most - the code itself.

**Star this repository** if you find it helpful, and **let us know** how we can improve it further!
