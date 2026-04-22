/**
 * BRANCH_SYNC.CJS - ASA Architecture (Branch Normalization)
 * Purpose: Force rename current branch to 'main' and prepare final verification.
 * Documentation: https://vibe-talent.gitbook.io/untitled
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

const USERNAME = "runas555";
const REPO_NAME = "insight-daily-platform";

function prepareMainBranch() {
    console.log(`${ANSI.cyan}--- ASA BRANCH & VERIFICATION SYNC ---${ANSI.reset}`);

    try {
        // 1. ENSURE VERIFICATION FILE IS PERFECT
        fs.writeFileSync('.vibetalent', USERNAME);
        console.log(`${ANSI.green}[OK]${ANSI.reset} .vibetalent strictly set to: ${USERNAME}`);

        // 2. SYNC PACKAGE.JSON
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.name = REPO_NAME;
            pkg.repository = {
                "type": "git",
                "url": `https://github.com/${USERNAME}/${REPO_NAME}.git`
            };
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
            console.log(`${ANSI.green}[OK]${ANSI.reset} package.json repository field updated.`);
        }

        // 3. GIT BRANCH TRANSFORMATION (From '2' to 'main')
        console.log(`${ANSI.yellow}Transforming branch '2' -> 'main'...${ANSI.reset}`);
        try {
            // Rename current branch to main
            execSync('git branch -M main');
            console.log(`${ANSI.green}[OK]${ANSI.reset} Local branch is now 'main'.`);
        } catch (e) {
            console.log(`${ANSI.red}[SKIP]${ANSI.reset} Branch rename failed (possibly already on main).`);
        }

        // 4. REMOTE URL SYNC
        try {
            const remoteUrl = `https://github.com/${USERNAME}/${REPO_NAME}.git`;
            execSync(`git remote set-url origin ${remoteUrl}`);
            console.log(`${ANSI.green}[OK]${ANSI.reset} Remote origin fixed: ${remoteUrl}`);
        } catch (e) {
            console.log(`${ANSI.red}[SKIP]${ANSI.reset} Remote set failed.`);
        }

        // 5. FINAL INSTRUCTIONS
        console.log(`\n${ANSI.cyan}--- READY FOR VERIFICATION ---${ANSI.reset}`);
        console.log(`${ANSI.white}Run these commands in your terminal to finish:${ANSI.reset}`);
        console.log(`\n1. ${ANSI.green}git add .${ANSI.reset}`);
        console.log(`2. ${ANSI.green}git commit -m "ASA: Branch main and verification sync"${ANSI.reset}`);
        console.log(`3. ${ANSI.green}git push -u origin main --force${ANSI.reset}`);
        
        console.log(`\n${ANSI.yellow}Why this works:${ANSI.reset}`);
        console.log(`- VibeTalent looks for the ${ANSI.cyan}main${ANSI.reset} branch by default.`);
        console.log(`- The ${ANSI.cyan}.vibetalent${ANSI.reset} file must be in the root of the ${ANSI.cyan}main${ANSI.reset} branch.`);
        console.log(`- Owner Match checks the ${ANSI.cyan}repository${ANSI.reset} field in package.json.`);

    } catch (err) {
        console.error(`${ANSI.red}[FATAL ERROR]${ANSI.reset} ${err.message}`);
    }
}

prepareMainBranch();