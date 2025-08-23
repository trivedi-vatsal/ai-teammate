#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building AI Teammate Action...');

try {
  // Clean dist directory
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Build with ncc
  console.log('⚡ Building with ncc...');
  execSync('npx ncc build src/index.js -o dist', { stdio: 'inherit' });

  // Copy action.yml to dist and update main path
  console.log('📋 Copying action.yml...');
  fs.copyFileSync('action.yml', 'dist/action.yml');
  
  // Update the main path in dist/action.yml to point to index.js (not dist/index.js)
  const actionYmlPath = path.join('dist', 'action.yml');
  let actionYmlContent = fs.readFileSync(actionYmlPath, 'utf8');
  actionYmlContent = actionYmlContent.replace('main: "dist/index.js"', 'main: "index.js"');
  fs.writeFileSync(actionYmlPath, actionYmlContent);

  console.log('✅ Build completed successfully!');
  console.log('📁 Output directory: dist/');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 