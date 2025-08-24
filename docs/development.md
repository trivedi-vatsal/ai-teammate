# Development Guide

## 🧪 Testing the Action

### Testing in Current Repository

To test the action in this repository:

1. **Setup secrets** in your repository settings:
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_MODEL_NAME`

2. **Create a test PR** - the action will automatically run via `.github/workflows/test-self.yml`

3. **Check the review** - AI Teammate will post a review comment on your PR

### Local Development Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for local testing (dist/ will be cleaned on commit)
npm run build:test

# Check Azure configuration
npm run check-config

# Build for production (used by release process)
npm run build

# Prepare for release
npm run prepare-release
```

### Development Workflow

The repository uses **pre-commit hooks** to maintain a clean codebase:

- ✅ **Automatic dist/ cleanup** - The `dist/` folder is automatically removed before each commit
- ✅ **Test execution** - Tests run automatically before each commit  
- ✅ **Release builds** - During releases, `dist/` is built and committed automatically

**For local testing:**

```bash
npm run build:test  # Build dist/ for testing (will be cleaned on commit)
```

**For releases:**

```bash
npm run prepare-release  # Automated release preparation
```

## 🚀 Publishing Process

Ready to publish your changes to GitHub Marketplace?

```bash
# 1. Prepare for release (runs tests, builds, commits dist/)
npm run prepare-release

# 2. Create and push release branch
git checkout -b release/v1.0.1
git push origin release/v1.0.1

# 3. Go to GitHub Actions tab and manually trigger "Release Action" workflow
# 4. The action will be published to GitHub Marketplace
```

### 🎯 Option 1 - Manual Release (Recommended):
1. Go to GitHub Actions tab
2. Select "Release Action" workflow
3. Click "Run workflow"
4. Choose version type (patch/minor/major)
5. Click "Run workflow" button
   → This will automatically update package.json, build, and release

### 🎯 Option 2 - Branch-based Release:
1. Choose a version and create release branch
2. Update package.json version manually
3. Push the release branch
4. Release workflow will run automatically

### 🤖 The workflow will:
- ✅ Run all tests
- ✅ Validate version consistency 
- ✅ Build the action
- ✅ Create GitHub release with detailed notes
- ✅ Update marketplace tags (v1, latest)
- ✅ Make action available on GitHub Marketplace

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Prerequisites

⚠️ **Node.js 20+ required**

```bash
# Clone the repository
git clone https://github.com/trivedi-vatsal/ai-teammate.git
cd ai-teammate

# Ensure you're using Node.js 20+
node --version  # Should show v20.x.x

# Install dependencies
npm install

# Build the action
npm run build

# Run tests
npm test
```
