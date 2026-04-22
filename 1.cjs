/**
 * FINAL_VERIFY.CJS - The "Green Badge" Synchronizer
 * Purpose: Fixes the .vibetalent content and ensures GitHub visibility.
 * 
 * Why it didn't appear automatically:
 * 1. The .vibetalent file must contain your EXACT GitHub username: "runas555".
 * 2. The code is only on your computer. The verification platform reads GITHUB, not your VS Code.
 * 3. We must fix the link to GitHub and PUSH the code.
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

const GITHUB_USERNAME = "runas555";
const REPO_NAME = "insight-daily-platform";

function finalizeVerification() {
    console.log(`${ANSI.cyan}--- VERIFICATION SYNC START ---${ANSI.reset}`);

    try {
        // 1. FIX THE VERIFICATION FILE CONTENT
        // It must be your username, not the word "owner"
        fs.writeFileSync('.vibetalent', GITHUB_USERNAME);
        console.log(`${ANSI.green}[OK]${ANSI.reset} .vibetalent updated with username: ${GITHUB_USERNAME}`);

        // 2. ENSURE PACKAGE.JSON MATCHES
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.name = REPO_NAME;
            pkg.author = GITHUB_USERNAME;
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
            console.log(`${ANSI.green}[OK]${ANSI.reset} package.json synchronized.`);
        }

        // 3. REPAIR GIT REMOTE (Force update to the new name)
        try {
            const newUrl = `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`;
            execSync(`git remote set-url origin ${newUrl}`);
            console.log(`${ANSI.green}[OK]${ANSI.reset} Git remote set to: ${newUrl}`);
        } catch (e) {
            console.log(`${ANSI.yellow}[INFO]${ANSI.reset} Initializing git...`);
            execSync('git init');
            execSync(`git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`);
        }

        // 4. PREPARE THE PUSH
        console.log(`${ANSI.yellow}Preparing final commit...${ANSI.reset}`);
        try {
            execSync('git add .');
            execSync('git commit -m "Final verification sync: .vibetalent added"');
        } catch (e) {
            console.log(`${ANSI.cyan}No new changes to commit.${ANSI.reset}`);
        }

        // 5. THE CRITICAL STEP
        console.log(`\n${ANSI.red}!!! IMPORTANT !!!${ANSI.reset}`);
        console.log(`1. Open your browser and go to: https://github.com/runas555`);
        console.log(`2. Create a NEW repository named: ${ANSI.green}${REPO_NAME}${ANSI.reset}`);
        console.log(`3. ONLY THEN run the command below in your terminal:\n`);
        
        console.log(`${ANSI.cyan}git push -u origin main${ANSI.reset}\n`);

        console.log(`${ANSI.yellow}--- WHY THIS IS NECESSARY ---${ANSI.reset}`);
        console.log(`The verification platform (VibeTalent) looks at your GITHUB profile.`);
        console.log(`If the repository doesn't exist on GitHub.com yet, it cannot verify it.`);
        console.log(`Once you push, the .vibetalent file will be visible to the platform.`);

    } catch (err) {
        console.error(`${ANSI.red}[ERROR]${ANSI.reset} ${err.message}`);
    }
}

finalizeVerification();

/**
 * PRODUCTION CHECKLIST:
 * [X] .vibetalent contains "runas555"
 * [X] package.json name is "insight-daily-platform"
 * [X] vercel.json is ready for deployment
 * [X] SEO sitemap.xml logic is active
 * [X] Mobile UI with bottom tabs is active
 */