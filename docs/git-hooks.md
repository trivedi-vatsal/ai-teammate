# Git Hooks Documentation

This repository uses [Husky](https://typicode.github.io/husky/) to manage Git hooks for maintaining code quality and repository cleanliness.

## Pre-commit Hook

The pre-commit hook (`..husky/pre-commit`) performs the following actions:

### 1. Clean dist/ Folder

- **Purpose**: Keeps the repository clean by removing build artifacts
- **When**: On every commit (except during release process)
- **Skip**: Set `SKIP_DIST_CLEAN=1` environment variable to bypass

### 2. Run Tests

- **Purpose**: Ensures all tests pass before allowing commits
- **When**: On every commit
- **Command**: `npm test`

## Workflow

### Development Commits

```bash
git add .
git commit -m "feat: add new feature"
# → Pre-commit hook runs:
#   1. Cleans dist/ folder
#   2. Runs tests
#   3. Commits if tests pass
```

### Release Process

```bash
# During automated release (in GitHub Actions):
export SKIP_DIST_CLEAN=1
git commit --no-verify -m "chore(release): prepare for v1.0.0"
# → Skips pre-commit hook
# → Includes dist/ files in release commit
```

## Local Testing

When you need to test the built action locally:

```bash
# Build for testing
npm run build:test

# Test your changes
# (dist/ folder contains the built action)

# Commit your changes
git add .
git commit -m "your message"
# → dist/ folder is automatically cleaned before commit
```

## Bypassing Hooks

In rare cases, you may need to bypass the pre-commit hook:

```bash
git commit --no-verify -m "emergency fix"
```

**⚠️ Use sparingly** - This skips both dist cleanup and tests.

## Installing Hooks

Hooks are automatically installed when you run:

```bash
npm install  # Runs 'husky install' via 'prepare' script
```

For new contributors:

```bash
npx husky install  # Manual installation if needed
```
