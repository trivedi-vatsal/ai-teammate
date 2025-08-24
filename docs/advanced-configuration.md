# Advanced Configuration

## 🔧 Advanced Usage

### Custom Review Depth

The action supports three review depth levels with automatic token management:

#### Basic Review Mode

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'basic'   # Focused, concise review
    temperature: '0.1'      # More focused analysis
```

**Output**: Single collapsible "Key Points" section with essential observations

#### Comprehensive Review Mode (Default)

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'comprehensive'  # Balanced, thorough review
    temperature: '0.3'             # Balanced creativity
```

**Output**: Multiple collapsible sections including Strengths, Improvements, and Security

#### Expert Review Mode

```yaml
- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  with:
    azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
    azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
    azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
    review_depth: 'expert'   # Deep technical analysis
    temperature: '0.1'       # More focused analysis
```

**Output**: Comprehensive sections including Architecture, Performance, Security, and Expert Recommendations

## 🎯 Dual Comment System

AI Teammate now posts **two separate comments** for better organization:

### Overview Comment Structure

```markdown
🤖 AI Teammate

## Overview
[Executive summary of changes and their impact]

## Changes
| File | Summary |
|------|---------|
| `filename.js` | [Specific improvements made] |

📊 Token Usage
- Input Tokens: 150
- Output Tokens: 75
- Total Tokens: 225
```

### Detailed Review Comment Structure

```markdown
🤖 AI Teammate - Detailed Review

<details><summary>✅ Strengths</summary>
[Recognition of good practices]
</details>

<details><summary>🔧 Suggestions for Improvement</summary>
[Specific, actionable recommendations]
</details>

<details><summary>🔒 Security Considerations</summary>
[Security analysis and best practices]
</details>

📊 Token Usage
```

**Benefits:**

- **Stakeholder-Friendly**: Overview comment perfect for managers/reviewers
- **Developer-Focused**: Detailed comment with technical specifics
- **Clean Organization**: Collapsible sections keep comments manageable
- **Cost Transparency**: Token usage tracking for budget management

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
