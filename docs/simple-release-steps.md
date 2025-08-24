# 🚀 Simple Release Steps

Quick and easy steps to release your AI Teammate GitHub Action.

## 📋 Prerequisites

- Node.js 20+ installed
- Repository ready with all changes committed
- Azure OpenAI credentials ready

## 🏷️ Release Your Action

### Option 1: Automated Release (Easiest)

1. **Go to GitHub**
   - Open your repository on GitHub
   - Click **Actions** tab
   - Find **"Release Action"** workflow

2. **Run the Release**
   - Click **"Run workflow"**
   - Choose version type:
     - `patch` (1.0.0 → 1.0.1) for bug fixes
     - `minor` (1.0.0 → 1.1.0) for new features  
     - `major` (1.0.0 → 2.0.0) for breaking changes
   - Click **"Run workflow"** button

3. **Wait for Completion**
   - Watch the workflow run (takes ~2-3 minutes)
   - Check **Releases** page for your new release

### Option 2: Manual Release Branch

1. **Prepare Release**

   ```bash
   npm run prepare-release
   ```

2. **Create Release Branch**

   ```bash
   git checkout -b release/v1.0.0
   git push origin release/v1.0.0
   ```

3. **Automatic Release**
   - Go to **Actions** tab
   - Release workflow runs automatically

## 🧪 Test Your Released Action

### Setup Test Repository Secrets

Add these secrets to any repository where you want to test:

Repository Settings → Secrets and variables → Actions

| Secret Name | Value |
|-------------|-------|
| `AZURE_OPENAI_ENDPOINT` | `https://your-resource.openai.azure.com/` |
| `AZURE_OPENAI_API_KEY` | `your-actual-api-key` |
| `AZURE_OPENAI_MODEL_NAME` | `gpt-4` or `gpt-35-turbo` |

### Create Test Workflow

Create `.github/workflows/ai-teammate.yml`:

```yaml
name: AI Teammate Test

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
      
      - name: AI PR Review
        uses: trivedi-vatsal/ai-teammate@v1.0.0  # Use your version
        with:
          azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
          azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
```

### Test Steps

1. **Create a test branch**

   ```bash
   git checkout -b test-ai-review
   echo "// Test change" >> README.md
   git add .
   git commit -m "test: trigger AI review"
   git push origin test-ai-review
   ```

2. **Create Pull Request**
   - Go to GitHub
   - Create PR from `test-ai-review` to `main`

3. **Check Results**
   - Go to **Actions** tab
   - Wait for workflow to complete
   - Check PR for AI review comment

## 📈 Publish to GitHub Marketplace

1. **After successful release**
   - Look for marketplace banner on your repository
   - Click **"Publish this action to the GitHub Marketplace"**

2. **Fill marketplace info**
   - Primary category: "Code quality"
   - Tags: `ai`, `code-review`, `azure-openai`
   - Submit for review

## ✅ Quick Checklist

**Before Release:**

- [ ] All code changes committed
- [ ] Tests pass locally (`npm test`)
- [ ] Version number is correct

**After Release:**

- [ ] Check **Releases** page shows new version
- [ ] Test action with a sample PR
- [ ] Verify AI review comments appear

**For Marketplace:**

- [ ] Action is publicly accessible
- [ ] README has clear usage examples
- [ ] License file exists

## 🆘 Troubleshooting

**Release fails?**

- Check Actions logs for errors
- Ensure branch follows `release/v*` pattern
- Verify all tests pass

**Action doesn't run?**

- Check repository secrets are set correctly
- Verify workflow file syntax
- Check permissions in workflow

**No AI review appears?**

- Check Azure OpenAI credentials
- Verify model name is correct
- Check workflow logs for errors

---

**That's it!** Your AI Teammate action is now released and ready to use. 🎉
