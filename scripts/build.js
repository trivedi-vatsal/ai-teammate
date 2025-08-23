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

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Build with ncc
  console.log('⚡ Building with ncc...');
  execSync('npx ncc build src/index.js -o dist', { stdio: 'inherit' });

  // Copy action.yml to dist
  console.log('📋 Copying action.yml...');
  fs.copyFileSync('action.yml', 'dist/action.yml');

  console.log('✅ Build completed successfully!');
  console.log('📁 Output directory: dist/');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 