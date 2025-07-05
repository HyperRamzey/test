#!/bin/bash

# GitHub Pages Deployment Script for xlam HUB
# This script handles the deployment process for GitHub Pages

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="xlam-hub"
VERSION=${VERSION:-$(git rev-parse --short HEAD 2>/dev/null || echo "2.0.0")}
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DEPLOY_BRANCH="gh-pages"
SOURCE_BRANCH="main"

echo -e "${BLUE}🚀 Starting GitHub Pages deployment for ${PROJECT_NAME}${NC}"
echo -e "${BLUE}📅 Build Time: ${BUILD_TIME}${NC}"
echo -e "${BLUE}🌐 Version: ${VERSION}${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Check if we have the necessary files
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the website directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
else
    print_status "Dependencies already installed"
fi

# Build the project
print_status "Building project with cache busting..."
npm run build:prod

# Check if build was successful
if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the build logs."
    exit 1
fi

print_status "Build completed successfully"

# Check if we're in GitHub Actions
if [ -n "$GITHUB_ACTIONS" ]; then
    print_status "Running in GitHub Actions - deployment will be handled by workflow"
    print_status "Build artifacts are ready for deployment"
    exit 0
fi

# Manual deployment (if not in GitHub Actions)
print_warning "Manual deployment mode detected"

# Check if we have the necessary files for deployment
required_files=("index.html" "css/styles.css" "js/app.js" "manifest.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file not found: $file"
        exit 1
    fi
done

print_status "All required files found"

# Create deployment info
cat > deployment-info.json << EOF
{
  "project": "${PROJECT_NAME}",
  "version": "${VERSION}",
  "buildTime": "${BUILD_TIME}",
  "deploymentType": "manual",
  "timestamp": "$(date +%s)",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')"
}
EOF

print_status "Deployment info created"

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/remotes/origin/${DEPLOY_BRANCH}; then
    print_status "Deploy branch ${DEPLOY_BRANCH} exists"
else
    print_warning "Deploy branch ${DEPLOY_BRANCH} does not exist. Creating..."
    git checkout --orphan ${DEPLOY_BRANCH}
    git rm -rf .
    git checkout ${SOURCE_BRANCH} -- .
fi

# Create .nojekyll file for GitHub Pages
touch .nojekyll

# Add all files
git add .

# Commit changes
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    git commit -m "Deploy ${PROJECT_NAME} v${VERSION} - ${BUILD_TIME}"
    print_status "Changes committed"
fi

# Push to deploy branch
print_status "Pushing to ${DEPLOY_BRANCH} branch..."
if git push origin ${DEPLOY_BRANCH}; then
    print_status "Successfully pushed to ${DEPLOY_BRANCH}"
else
    print_error "Failed to push to ${DEPLOY_BRANCH}"
    exit 1
fi

# Switch back to source branch
git checkout ${SOURCE_BRANCH}

print_status "Deployment completed successfully!"
echo -e "${BLUE}🌐 Your site should be available at: https://hyperramzey.github.io${NC}"
echo -e "${BLUE}📊 Deployment info saved to: deployment-info.json${NC}"

# Display deployment summary
echo -e "\n${GREEN}📋 Deployment Summary:${NC}"
echo -e "  Project: ${PROJECT_NAME}"
echo -e "  Version: ${VERSION}"
echo -e "  Build Time: ${BUILD_TIME}"
echo -e "  Deploy Branch: ${DEPLOY_BRANCH}"
echo -e "  Source Branch: ${SOURCE_BRANCH}"

# Check for any warnings
if [ -f "deployment-info.json" ]; then
    echo -e "\n${YELLOW}📝 Next Steps:${NC}"
    echo -e "  1. Wait a few minutes for GitHub Pages to update"
    echo -e "  2. Check your site at https://hyperramzey.github.io"
    echo -e "  3. Verify cache busting is working by checking resource URLs"
    echo -e "  4. Monitor the deployment in GitHub repository settings"
fi

echo -e "\n${GREEN}✨ Deployment script completed!${NC}" 