#!/bin/bash

# Generate Terminal Recordings for Conductor CLI
# Requires VHS: https://github.com/charmbracelet/vhs

set -e

echo "🎬 Generating terminal recordings for Conductor CLI..."

# Create recordings directory if it doesn't exist
mkdir -p recordings/output

# Check if VHS is installed
if ! command -v vhs &> /dev/null; then
    echo "❌ VHS not found. Installing..."
    echo "📦 Run: brew install vhs"
    echo "📦 Or: go install github.com/charmbracelet/vhs@latest"
    exit 1
fi

echo "✅ VHS found, generating recordings..."

# Generate all recordings
cd recordings

echo "🚂 Generating main demo..."
vhs conductor-demo.tape

echo "⚡ Generating quick start demo..."  
vhs quick-start.tape

echo "📊 Generating dashboard demo..."
vhs dashboard-demo.tape

echo "🦆 Generating rubber duck demo..."
vhs rubber-duck-demo.tape

# Move outputs to output directory
mv *.gif output/

echo "🎉 All recordings generated successfully!"
echo "📁 Recordings saved to: recordings/output/"

# List generated files
ls -la output/

echo ""
echo "🌐 To use in landing page:"
echo "   1. Copy GIFs to your web assets folder"
echo "   2. Update index.html with <img> or <video> tags"
echo "   3. Consider converting to WebM for better performance"
echo ""
echo "🔄 To regenerate: npm run recordings"