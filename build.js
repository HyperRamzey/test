#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONFIG = {
  version: process.env.VERSION || '2.0.0',
  buildTime: new Date().toISOString(),
  files: {
    html: ['index.html'],
    css: ['css/styles.css'],
    js: ['js/app.js', 'sw.js'],
    assets: ['manifest.json']
  }
};

console.log(`Building xlam HUB v${CONFIG.version} for GitHub Pages`);

const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error.message);
    return null;
  }
};

const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Failed to write ${filePath}:`, error.message);
  }
};

const updateVersions = () => {
  console.log('\nUpdating version numbers...');
  
  CONFIG.files.html.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = readFile(filePath);
    
    if (!content) return;
    
    content = content.replace(/v=\d+\.\d+\.\d+/g, `v=${CONFIG.version}`);
    content = content.replace(/version="\d+\.\d+\.\d+"/g, `version="${CONFIG.version}"`);
    
    writeFile(filePath, content);
  });
  
  CONFIG.files.js.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = readFile(filePath);
    
    if (!content) return;
    
    content = content.replace(/const APP_VERSION = ['"][^'"]*['"]/g, `const APP_VERSION = '${CONFIG.version}'`);
    content = content.replace(/const CACHE_VERSION = ['"][^'"]*['"]/g, `const CACHE_VERSION = '${CONFIG.version}'`);
    
    writeFile(filePath, content);
  });
  
  const manifestPath = path.join(__dirname, 'manifest.json');
  let manifestContent = readFile(manifestPath);
  
  if (manifestContent) {
    try {
      const manifest = JSON.parse(manifestContent);
      manifest.version = CONFIG.version;
      writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    } catch (error) {
      console.error('Failed to parse manifest.json:', error.message);
    }
  }
};

const createGitHubPagesFiles = () => {
  console.log('\nCreating GitHub Pages files...');
  
  writeFile(path.join(__dirname, '.nojekyll'), '');
  
  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://hyperramzey.github.io/sitemap.xml`;
  writeFile(path.join(__dirname, 'robots.txt'), robotsContent);
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hyperramzey.github.io/</loc>
    <lastmod>${CONFIG.buildTime}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  writeFile(path.join(__dirname, 'sitemap.xml'), sitemapContent);
  
  const buildInfo = {
    version: CONFIG.version,
    buildTime: CONFIG.buildTime,
    buildType: 'github-pages',
    features: {
      gpuAcceleration: true,
      serviceWorker: true,
      pwa: true,
      cacheBusting: true
    }
  };
  writeFile(path.join(__dirname, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
};

const validateBuild = () => {
  console.log('\nValidating build...');
  
  const requiredFiles = [
    'index.html',
    'css/styles.css',
    'js/app.js',
    'sw.js',
    'manifest.json',
    '.nojekyll',
    'robots.txt',
    'sitemap.xml'
  ];
  
  let allValid = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing required file: ${file}`);
      allValid = false;
    } else {
      console.log(`Found ${file}`);
    }
  });
  
  if (allValid) {
    console.log('\nBuild validation passed!');
    console.log(`Version: ${CONFIG.version}`);
    console.log(`Build time: ${CONFIG.buildTime}`);
    console.log('\nReady for GitHub Pages deployment!');
  } else {
    console.log('\nBuild validation failed!');
    process.exit(1);
  }
};

const build = () => {
  console.log('Starting build process...\n');
  
  updateVersions();
  createGitHubPagesFiles();
  validateBuild();
};

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
xlam HUB Build Script

Usage: node build.js [options]

Options:
  --version <version>  Set version number
  --help, -h          Show this help message

Examples:
  node build.js
  node build.js --version 2.1.0
  `);
  process.exit(0);
}

if (args.includes('--version')) {
  const versionIndex = args.indexOf('--version');
  if (versionIndex + 1 < args.length) {
    CONFIG.version = args[versionIndex + 1];
  }
}

build(); 