#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔨 Building AI Teammate Action...");

try {
  // Clean dist directory
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
  }

  // Build with ncc
  console.log("⚡ Building with ncc...");
  execSync("npx ncc build src/index.js -o dist", { stdio: "inherit" });

  console.log("✅ Build completed successfully!");
  console.log("📁 Output directory: dist/");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
