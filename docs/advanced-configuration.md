# Advanced Configuration

## 🔧 Advanced Usage

### Custom Review Depth

The action supports three review depth levels:

#### Quick Review Mode

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

#### Balanced Review Mode (Default)

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

#### Deep Analysis Mode

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
