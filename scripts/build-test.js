#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🧪 Building for local testing...");

try {
  // Build the action
  console.log("⚡ Building with ncc...");
  execSync("npm run build", { stdio: "inherit" });

  console.log("✅ Build completed successfully!");
  console.log("📁 Output: dist/index.js");
  
  console.log("\n⚠️  Note: The dist/ folder will be cleaned on your next commit.");
  console.log("💡 To test the action locally, use the files in dist/ before committing.");
  console.log("🚀 For releases, dist/ will be automatically built and included.");
  
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
