# Architecture & Technical Details

## 🏗️ Architecture

### How It Works

1. **Trigger**: Automatically runs on PR events
2. **Analysis**: Fetches PR changes via GitHub API
3. **AI Review**: Sends structured prompts to Azure OpenAI
4. **Processing**: Analyzes AI response for quality
5. **Output**: Posts detailed review to PR
6. **Feedback**: Provides actionable next steps

### Technical Stack

- **Runtime**: Node.js 20+ (required for Azure OpenAI compatibility)
- **AI Service**: Azure OpenAI (GPT-4, GPT-3.5-turbo)
- **GitHub Integration**: Octokit for API calls
- **Structured Prompts**: XML format for LLM optimization
- **Error Handling**: Comprehensive error management and logging

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
