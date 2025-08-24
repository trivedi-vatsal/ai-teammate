#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing AI Teammate for Release...\n');

// Check if we're on the main branch
const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
if (currentBranch !== 'main') {
  console.error('❌ Must be on main branch to prepare release');
  console.log('💡 Run: git checkout main');
  process.exit(1);
}

// Check if working directory is clean
try {
  execSync('git diff-index --quiet HEAD --', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Working directory is not clean');
  console.log('💡 Commit or stash your changes first');
  process.exit(1);
}

// Run tests
console.log('🧪 Running tests...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('✅ All tests passed\n');
} catch (error) {
  console.error('❌ Tests failed');
  process.exit(1);
}

// Build the action
console.log('🔨 Building action...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Check if dist/ has changes
try {
  execSync('git diff --exit-code dist/', { stdio: 'pipe' });
  console.log('✅ dist/ is up to date\n');
} catch (error) {
  console.log('📦 dist/ has changes, committing...');
  execSync('git add dist/', { stdio: 'inherit' });
  execSync('git commit -m "chore: update dist/ for release"', { stdio: 'inherit' });
  console.log('✅ dist/ committed\n');
}

// Get current version from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const currentVersion = packageJson.version;

console.log(`📋 Current version: ${currentVersion}`);

// Suggest next version
const [major, minor, patch] = currentVersion.split('.').map(Number);
const suggestions = {
  patch: `${major}.${minor}.${patch + 1}`,
  minor: `${major}.${minor + 1}.0`,
  major: `${major + 1}.0.0`
};

console.log('\n🔢 Suggested versions:');
console.log(`  Patch (bug fixes): ${suggestions.patch}`);
console.log(`  Minor (new features): ${suggestions.minor}`);
console.log(`  Major (breaking changes): ${suggestions.major}`);

console.log('\n📝 Next steps for release:');
console.log('\n🎯 Option 1 - Manual Release (Recommended):');
console.log('1. Go to GitHub Actions tab');
console.log('2. Select "Release Action" workflow');
console.log('3. Click "Run workflow"');
console.log('4. Choose version type (patch/minor/major)');
console.log('5. Click "Run workflow" button');
console.log('   → This will automatically update package.json, build, and release');

console.log('\n🎯 Option 2 - Branch-based Release:');
console.log('1. Choose a version and create release branch:');
console.log(`   git checkout -b release/v${suggestions.patch}`);
console.log('2. Update package.json version manually');
console.log('3. Push the release branch:');
console.log(`   git push origin release/v${suggestions.patch}`);
console.log('4. Release workflow will run automatically');

console.log('\n🤖 The workflow will:');
console.log('   - ✅ Run all tests');
console.log('   - ✅ Validate version consistency'); 
console.log('   - ✅ Build the action');
console.log('   - ✅ Create GitHub release with detailed notes');
console.log('   - ✅ Update marketplace tags (v1, latest)');
console.log('   - ✅ Make action available on GitHub Marketplace');

console.log('\n🎉 Ready for release!');
