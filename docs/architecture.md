# Architecture & Technical Details

## 🏗️ Architecture

### How It Works

1. **Trigger**: Automatically runs on PR events
2. **Analysis**: Fetches PR changes with detailed diffs via GitHub API
3. **Smart Processing**: Intelligently handles large files and token limits
4. **Dual AI Review**: Generates both overview summary and detailed review
5. **XML Prompts**: Uses structured XML prompts optimized for LLMs
6. **Dual Comments**: Posts two separate comments for better organization
7. **Token Tracking**: Provides API usage statistics for cost management

### Technical Stack

- **Runtime**: Node.js 20+ (required for Azure OpenAI compatibility)
- **AI Service**: Azure OpenAI (GPT-4, GPT-3.5-turbo)
- **GitHub Integration**: Octokit for API calls
- **Structured Prompts**: XML format for LLM optimization
- **Smart Processing**: Token-aware file processing with size limits
- **Dual Output**: Separate overview and detailed review comments
- **Collapsible UI**: Details/summary tags for organized feedback
- **Error Handling**: Comprehensive error management and logging

## 📊 What AI Teammate Reviews

### 🔍 Dual Comment System

**Overview Comment:**

1. **Header**: AI Teammate branding and identification
2. **Executive Summary**: Clear, compelling overview of changes
3. **Changes Table**: Organized breakdown of file modifications
4. **Token Usage**: API consumption statistics

**Detailed Review Comment:**

1. **Strengths**: Recognition of good practices and quality code
2. **Improvements**: Specific, actionable recommendations
3. **Security**: Vulnerability analysis and best practices
4. **Additional Sections**: Architecture, performance (expert mode)
5. **Collapsible Format**: Clean, organized using details/summary tags

### 🎯 Review Philosophy

- **Pure Code Analysis**: Focuses only on actual code modifications, ignoring PR metadata
- **Dual Perspective**: Overview for stakeholders, detailed review for developers
- **Constructive Feedback**: Provides actionable improvement suggestions with examples
- **Security First**: Identifies potential security vulnerabilities proactively
- **Best Practices**: Ensures code follows industry standards and patterns
- **Maintainability**: Considers long-term code health and evolution

## 📈 Performance & Costs

### Smart Processing Features

- **Token-Aware Processing**: Automatically handles large files within token limits
- **File Size Management**: Truncates large diffs while preserving context
- **Batch Processing**: Processes multiple files efficiently in sequence
- **Usage Tracking**: Built-in token usage reporting for cost monitoring

### Optimization Tips

- **Review Depth**: Use `basic` for simple changes, `expert` for complex PRs
- **Temperature**: Lower values (0.1-0.3) for focused, consistent reviews
- **Selective Triggering**: Only run on relevant PR events (opened, synchronize)
- **File Monitoring**: Review reports show exactly which files were processed

### Cost Management

- **Automatic Token Monitoring**: Built-in usage tracking prevents unexpected costs
- **Smart File Processing**: Only processes files that fit within token budgets  
- **Transparent Reporting**: Every comment includes exact token usage statistics
- **Processing Efficiency**: Dual API calls (overview + review) provide maximum value per token
- **Depth-Based Scaling**: Choose review depth to match your cost requirements

**Expected Token Usage per PR:**

- **Basic Review**: ~500-1,500 tokens total
- **Comprehensive Review**: ~1,000-3,000 tokens total  
- **Expert Review**: ~2,000-6,000 tokens total

*Note: Actual usage depends on PR size and complexity. Large PRs are automatically optimized to stay within limits.*

### Additional Cost Tips

- **Optimize Prompts**: Efficient prompts reduce token usage
- **Batch Reviews**: Consider reviewing multiple PRs together  
- **Set Limits**: Use Azure spending limits and alerts
