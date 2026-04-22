/**
 * FIX_GIT_REMOTE.CJS - Emergency Git Repair & Vercel Production Prep
 * Purpose: Fixes the "Repository not found" error by helping you re-link the remote.
 * Also prepares the final Vercel configuration for instant deployment.
 */

const fs = require('fs');
const { execSync } = require('child_process');

const ANSI = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m"
};

const NEW_REPO_NAME = "insight-daily-platform";

function repair() {
    console.log(`${ANSI.cyan}--- ASA REPAIR MODULE ---${ANSI.reset}`);

    // 1. DIAGNOSE REMOTE
    let currentRemote = "";
    try {
        currentRemote = execSync('git remote get-url origin').toString().trim();
        console.log(`${ANSI.yellow}Current Local Remote:${ANSI.reset} ${currentRemote}`);
    } catch (e) {
        console.log(`${ANSI.red}No git remote found.${ANSI.reset}`);
    }

    // 2. VERCEL PRODUCTION CONFIG (PROD-READY)
    const vercelConfig = {
        version: 2,
        name: NEW_REPO_NAME,
        builds: [
            { src: "index.js", use: "@vercel/node" }
        ],
        routes: [
            { "src": "/style.css", "dest": "/public/style.css" },
            { "src": "/sitemap.xml", "dest": "/index.js" },
            { "src": "/robots.txt", "dest": "/index.js" },
            { "src": "/(.*)", "dest": "/index.js" }
        ],
        env: {
            "NODE_ENV": "production"
        }
    };

    try {
        fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
        console.log(`${ANSI.green}[OK]${ANSI.reset} vercel.json optimized for production.`);
    } catch (err) {
        console.error(`${ANSI.red}[ERR]${ANSI.reset} Failed to write vercel.json`);
    }

    // 3. INSTRUCTIONS FOR THE USER (The "Why" it failed)
    console.log(`\n${ANSI.yellow}!!! ACTION REQUIRED !!!${ANSI.reset}`);
    console.log(`The push failed because your local git is looking for:`);
    console.log(`${ANSI.cyan}${currentRemote}${ANSI.reset}`);
    console.log(`But on GitHub.com, the repository still has the OLD name.\n`);
    
    console.log(`${ANSI.green}STEP 1:${ANSI.reset} Go to GitHub.com -> Settings -> Rename to "${NEW_REPO_NAME}"`);
    console.log(`${ANSI.green}STEP 2:${ANSI.reset} Run this command in your terminal:`);
    console.log(`${ANSI.white}git remote set-url origin https://github.com/runas555/${NEW_REPO_NAME}.git${ANSI.reset}\n`);

    // 4. ADD VERCEL HELPER MODULE
    const deployHelper = `
/**
 * CORE/DEPLOY.JS - Vercel Environment Detection
 */
module.exports = {
    isProd: process.env.NODE_ENV === 'production',
    getDomain: (req) => req.headers['x-forwarded-host'] || req.headers.host
};`;
    
    const dir = 'core';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'Deploy.js'), deployHelper);
    console.log(`${ANSI.green}[OK]${ANSI.reset} core/Deploy.js created.`);

    // 5. UPDATE INDEX.JS FOR VERCEL
    const indexContent = fs.readFileSync('index.js', 'utf8');
    if (!indexContent.includes('module.exports')) {
        const updatedIndex = indexContent + `\n// Export for Vercel Serverless\nmodule.exports = server;`;
        fs.writeFileSync('index.js', updatedIndex);
        console.log(`${ANSI.green}[OK]${ANSI.reset} index.js updated for Vercel Serverless.`);
    }

    console.log(`\n${ANSI.cyan}--- REPAIR COMPLETE ---${ANSI.reset}`);
    console.log(`Once you rename the repo on GitHub, everything will sync automatically.`);
}

const path = require('path');
repair();