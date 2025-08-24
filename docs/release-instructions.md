# 🚀 Release Instructions

This guide provides simple, step-by-step instructions for releasing the AI Teammate GitHub Action and testing it.

## 📋 Prerequisites

Before starting, ensure you have:

- [ ] Node.js 20+ installed
- [ ] Git configured with your GitHub account
- [ ] Azure OpenAI account with API access
- [ ] Repository cloned locally

## 🧪 Step 1: Test the Action Locally

### 1.1 Setup Local Environment

```bash
# Navigate to the repository
cd ai-teammate

# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Check Azure configuration (optional - needs .env file)
npm run check-config
```

### 1.2 Build for Testing

```bash
# Build the action for local testing
npm run build:test
```

⚠️ **Note**: The `dist/` folder will be automatically cleaned when you commit (pre-commit hook).

## 🔄 Step 2: Test in This Repository

### 2.1 Add Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `AZURE_OPENAI_ENDPOINT` | `https://your-resource.openai.azure.com/` | Azure Portal → Your OpenAI Resource |
| `AZURE_OPENAI_API_KEY` | `your-actual-api-key` | Azure Portal → Keys and Endpoint |
| `AZURE_OPENAI_MODEL_NAME` | `gpt-4` or `gpt-35-turbo` | Your deployed model name |

### 2.2 Test with a Pull Request

1. **Create a test branch:**

   ```bash
   git checkout -b test-ai-teammate
   ```

2. **Make a small change** (e.g., add a comment to a file):

   ```bash
   echo "// Test comment for AI review" >> src/index.js
   git add .
   git commit -m "test: add comment for AI teammate testing"
   git push origin test-ai-teammate
   ```

3. **Create a Pull Request:**
   - Go to GitHub → **Pull requests** → **New pull request**
   - Select `test-ai-teammate` → `main`
   - Create the PR

4. **Check the Action Runs:**
   - Go to **Actions** tab in your repository
   - Look for "Test AI Teammate in Current Repo" workflow
   - Wait for it to complete
   - Check the PR for an AI review comment

### 2.3 Verify Results

✅ **Success indicators:**

- Workflow runs without errors
- AI review comment appears on the PR
- Review contains meaningful feedback about your changes

❌ **If it fails:**

- Check the workflow logs in the Actions tab
- Verify your Azure OpenAI secrets are correct
- See [Troubleshooting Guide](./troubleshooting.md)

## 🏷️ Step 3: Create a Release

### Method 1: Automated Release (Recommended)

1. **Go to GitHub Actions:**
   - Navigate to your repository → **Actions** tab
   - Find "Release Action" workflow

2. **Run Manual Release:**
   - Click **"Run workflow"**
   - Choose version type:
     - **patch** (1.0.0 → 1.0.1) - Bug fixes
     - **minor** (1.0.0 → 1.1.0) - New features
     - **major** (1.0.0 → 2.0.0) - Breaking changes
   - Click **"Run workflow"**

3. **Wait for Completion:**
   - The workflow will automatically:
     - ✅ Run tests
     - ✅ Update package.json version
     - ✅ Build the action
     - ✅ Create GitHub release
     - ✅ Update marketplace tags

### Method 2: Manual Release Branch

1. **Prepare for Release:**

   ```bash
   npm run prepare-release
   ```

2. **Create Release Branch:**

   ```bash
   git checkout -b release/v1.0.0
   git push origin release/v1.0.0
   ```

3. **Release Workflow Runs Automatically:**
   - Check the Actions tab
   - The release workflow will trigger automatically

## 🎯 Step 4: Verify Release

### 4.1 Check GitHub Release

1. Go to your repository → **Releases**
2. Verify the new release appears with:
   - ✅ Correct version number
   - ✅ Release notes
   - ✅ Built assets

### 4.2 Test Released Action

Create a test repository or use another repository:

```yaml
# .github/workflows/test-released-action.yml
name: Test Released AI Teammate

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  test-action:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
      
      - name: Test AI Teammate
        uses: your-username/ai-teammate@v1.0.0  # Use your actual release
        with:
          azure_openai_endpoint: ${{ secrets.AZURE_OPENAI_ENDPOINT }}
          azure_openai_api_key: ${{ secrets.AZURE_OPENAI_API_KEY }}
          azure_openai_model_name: ${{ secrets.AZURE_OPENAI_MODEL_NAME }}
```

## 📈 Step 5: Publish to Marketplace (Optional)

### 5.1 Add to GitHub Marketplace

1. **Go to your repository**
2. **Look for the banner** that says "Publish this action to the GitHub Marketplace"
3. **Click "Draft a release"** if the banner appears
4. **Fill in marketplace information:**
   - Primary category: "Code quality"
   - Secondary category: "Code review"
   - Tags: `ai`, `code-review`, `azure-openai`, `pull-request`

### 5.2 Marketplace Guidelines

Ensure your action meets GitHub's requirements:

- ✅ Clear README with usage examples
- ✅ Proper action.yml metadata
- ✅ MIT license
- ✅ Working examples
- ✅ Appropriate branding

## 🔧 Common Issues & Solutions

### Build Failures

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Test Failures

```bash
# Run tests with verbose output
npm test -- --verbose
```

### Release Workflow Issues

- Check that branch name follows `release/v*` pattern
- Verify all tests pass before release
- Ensure dist/ folder is properly built

### Azure OpenAI Connection Issues

```bash
# Test Azure configuration
npm run check-config
```

## ✅ Quick Checklist

Before releasing:

- [ ] All tests pass (`npm test`)
- [ ] Action builds successfully (`npm run build`)
- [ ] Azure OpenAI secrets are configured
- [ ] Self-test workflow works on a test PR
- [ ] Version number is correct
- [ ] Release notes are meaningful

After releasing:

- [ ] GitHub release is created
- [ ] Tags are updated (v1, latest)
- [ ] Action works with released version
- [ ] Marketplace listing is accurate (if published)

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/trivedi-vatsal/ai-teammate/issues)
- **Documentation**: [Troubleshooting Guide](./troubleshooting.md)
- **Development**: [Development Guide](./development.md)
