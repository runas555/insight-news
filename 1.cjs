/**
 * MIGRATION_TO_INSIGHT_NEWS.CJS
 * Purpose: Move project to the new 'insight-news' repository and fix verification.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ANSI = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m"
};

const USERNAME = "runas555";
const NEW_REPO = "insight-news";

function migrate() {
    console.log(`${ANSI.cyan}--- MIGRATION TO ${NEW_REPO} ---${ANSI.reset}`);

    try {
        // 1. UPDATE PACKAGE.JSON
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.name = NEW_REPO;
            pkg.repository = {
                "type": "git",
                "url": `https://github.com/${USERNAME}/${NEW_REPO}.git`
            };
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
            console.log(`${ANSI.green}[OK]${ANSI.reset} package.json updated.`);
        }

        // 2. UPDATE VERCEL.JSON
        if (fs.existsSync('vercel.json')) {
            const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
            vercel.name = NEW_REPO;
            fs.writeFileSync('vercel.json', JSON.stringify(vercel, null, 2));
            console.log(`${ANSI.green}[OK]${ANSI.reset} vercel.json updated.`);
        }

        // 3. STRICT VERIFICATION FILE
        fs.writeFileSync('.vibetalent', USERNAME);
        console.log(`${ANSI.green}[OK]${ANSI.reset} .vibetalent set to "${USERNAME}".`);

        // 4. GIT RE-LINKING
        console.log(`${ANSI.yellow}Re-linking Git to ${NEW_REPO}...${ANSI.reset}`);
        try {
            // Check if git is initialized
            execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
            execSync(`git remote set-url origin https://github.com/${USERNAME}/${NEW_REPO}.git`);
        } catch (e) {
            execSync('git init');
            execSync(`git remote add origin https://github.com/${USERNAME}/${NEW_REPO}.git`);
        }

        // 5. BRANCH NORMALIZATION
        try {
            execSync('git branch -M main');
            console.log(`${ANSI.green}[OK]${ANSI.reset} Branch set to "main".`);
        } catch (e) {
            console.error(`${ANSI.red}[ERR]${ANSI.reset} Could not rename branch.`);
        }

        // 6. FINAL INSTRUCTIONS
        console.log(`\n${ANSI.cyan}--- PREPARATION COMPLETE ---${ANSI.reset}`);
        console.log(`The project is now configured for: ${ANSI.green}https://github.com/${USERNAME}/${NEW_REPO}${ANSI.reset}`);
        
        console.log(`\n${ANSI.yellow}RUN THESE COMMANDS MANUALLY:${ANSI.reset}`);
        console.log(`${ANSI.white}1. git add .${ANSI.reset}`);
        console.log(`${ANSI.white}2. git commit -m "Final migration to insight-news"${ANSI.reset}`);
        console.log(`${ANSI.white}3. git push -u origin main --force${ANSI.reset}`);

        console.log(`\n${ANSI.cyan}After pushing, go to the platform and click Verify on the "insight-news" project.${ANSI.reset}`);

    } catch (err) {
        console.error(`${ANSI.red}[FATAL]${ANSI.reset} ${err.message}`);
    }
}

migrate();