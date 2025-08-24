# Troubleshooting Guide

## 🚨 Common Issues

### Authentication Errors

**Problem**: Azure OpenAI authentication fails

**Solutions**:

```bash
# Verify your Azure OpenAI credentials
# Check endpoint, API key, and model name
```

1. Verify your endpoint URL is correct
2. Check if your API key is valid and not expired
3. Ensure your model name is correct
4. Verify your Azure OpenAI resource is active
5. Check if you have proper permissions

### Permission Issues

**Problem**: GitHub Actions lacks permissions

**Solution**:

```yaml
# Ensure workflow has correct permissions
permissions:
  contents: read
  pull-requests: write
```

### Rate Limiting

**Problem**: API rate limits exceeded

**Solutions**:

```yaml
# Reduce frequency or increase delays
on:
  pull_request:
    types: [opened]  # Only on new PRs
```

### Build Issues

**Problem**: Action fails to build or run

**Solutions**:

1. Check Node.js version (requires 20+)
2. Verify all dependencies are installed
3. Ensure dist/ directory exists and is built
4. Check for syntax errors in source code

### PR Detection Issues

**Problem**: Action can't find PR information

**Solutions**:

1. Ensure action runs on `pull_request` events
2. Check repository permissions
3. Verify GitHub token has proper scope

### Token Management Issues

**Problem**: Large PRs exceed token limits or cause high costs

**Solutions**:

1. **Use Basic Review Mode** for simple changes:

   ```yaml
   review_depth: 'basic'
   ```

2. **Monitor Token Usage**: Check the token usage reports in comments

   ```markdown
   📊 Token Usage
   - Input Tokens: 1,500
   - Output Tokens: 300
   - Total Tokens: 1,800
   ```

3. **File Processing Limits**: AI Teammate automatically:
   - Processes files in sequence with token monitoring
   - Truncates large files (>4,000 characters) with context preservation
   - Stops processing if token limit (~20,000) is reached
   - Reports how many files were processed vs. total files

**Expected Behavior**: You may see messages like:

```text
📊 Processed 5 of 8 files with detailed diffs
*Note: Processed 5 of 8 files. Remaining files omitted to stay within token limits.*
```

### Dual Comment System

**Expected Behavior**: AI Teammate posts **two separate comments**:

1. **Overview Comment**: Executive summary with changes table
2. **Detailed Review Comment**: Technical analysis with collapsible sections

**Problem**: Only seeing one comment

**Solutions**:

1. Check GitHub API rate limits
2. Verify pull-requests write permissions
3. Look for error messages in Actions logs
4. Both comments should appear within seconds of each other

## 🔧 Debug Mode

Enable debug logging by adding to your workflow:

```yaml
- name: Debug Information
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Repository: ${{ github.repository }}"
    echo "PR Number: ${{ github.event.pull_request.number }}"

- name: AI PR Review
  uses: trivedi-vatsal/ai-teammate@v1
  env:
    ACTIONS_STEP_DEBUG: true
  with:
    # ... your configuration
```

## 🔒 Security Considerations

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
