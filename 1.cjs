const fs = require('fs');
const path = require('path');

const DUMP_FILE = 'dump.txt';
const IGNORE_DIRS = ['node_modules', '.git', '.vercel', '.next'];
const IGNORE_FILES = [DUMP_FILE, 'setup.cjs', 'package-lock.json', '1.cjs'];

const backups = new Map();
let hasError = false;
const tasks = [];

/**
 * 1. СБОР ДАННЫХ (DUMP)
 */
function createDump() {
    console.log('--- [1/3] GENERATING DUMP ---');
    let dumpContent = '';
    const walk = (dir) => {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            const relPath = path.relative(process.cwd(), fullPath);
            if (fs.statSync(fullPath).isDirectory()) {
                if (!IGNORE_DIRS.includes(file)) walk(fullPath);
            } else if (!IGNORE_FILES.includes(file) && !file.endsWith('.bak')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    dumpContent += `\n// --- FILE_START: ${relPath} ---\n${content}\n// --- FILE_END: ${relPath} ---\n`;
                } catch (e) {}
            }
        });
    };
    walk(process.cwd());
    fs.writeFileSync(DUMP_FILE, dumpContent);
    console.log(`[OK]: ${DUMP_FILE} updated.`);
}

/**
 * 2. ОПРЕДЕЛЕНИЕ ЗАДАЧ
 */
function addReplacement(filePath, anchor, replacement, description) {
    tasks.push({ filePath, anchor, replacement, description });
}

// --- ПЕРЕХОД НА ЛОГИН И ПАРОЛЬ ---

// 1. Меняем константы в Router.js
addReplacement(
    'core/Router.js',
    'const ADMIN_PIN = "1234";',
    'const ADMIN_USER = "admin";\nconst ADMIN_PASS = "admin123";',
    "Замена PIN на LOGIN/PASSWORD константы"
);

// 2. Обновляем логику проверки в /api/login (Router.js)
addReplacement(
    'core/Router.js',
    "if (p.get('pin') === ADMIN_PIN)",
    "if (p.get('user') === ADMIN_USER && p.get('pass') === ADMIN_PASS)",
    "Обновление проверки логина и пароля в API"
);

// 3. Обновляем форму входа во Views.js
addReplacement(
    'core/Views.js',
    '<input type="password" name="pin" placeholder="Enter Security PIN" required>',
    '<input type="text" name="user" placeholder="Username" required>\n                        <input type="password" name="pass" placeholder="Password" required>',
    "Добавление полей Логин и Пароль в форму входа"
);

// 4. Улучшаем заголовок формы во Views.js
addReplacement(
    'core/Views.js',
    '<h2>Admin Access</h2>',
    '<h2>Management Login</h2>',
    "Обновление заголовка формы"
);

/**
 * 3. ИСПОЛНЕНИЕ С ТРАНЗАКЦИЕЙ
 */
function runTransformations() {
    console.log('\n--- [2/3] APPLYING LOGIN LOGIC ---');
    const changedFiles = new Set();

    for (const task of tasks) {
        if (hasError) break;
        const { filePath, anchor, replacement, description } = task;

        if (!fs.existsSync(filePath)) {
            console.log(`[FAIL]: File not found: ${filePath}`);
            hasError = true; break;
        }

        if (!changedFiles.has(filePath)) {
            const original = fs.readFileSync(filePath, 'utf8');
            backups.set(filePath, original);
            fs.writeFileSync(filePath + '.bak', original);
            changedFiles.add(filePath);
        }

        let content = fs.readFileSync(filePath, 'utf8');
        const escapedAnchor = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexStr = escapedAnchor.split(/\s+/).filter(s => s.length > 0).map(s => s + '\\s*').join('');
        const regex = new RegExp(regexStr, 'm');

        if (regex.test(content)) {
            fs.writeFileSync(filePath, content.replace(regex, () => replacement));
            console.log(`[SUCCESS]: ${description}`);
        } else {
            console.log(`[FAIL]: Anchor not found for: ${description}`);
            hasError = true;
        }
    }

    console.log('\n--- [3/3] FINALIZING ---');
    if (hasError) {
        console.log('[ROLLBACK]: Error detected. Restoring files...');
        backups.forEach((content, filePath) => {
            fs.writeFileSync(filePath, content);
            if (fs.existsSync(filePath + '.bak')) fs.unlinkSync(filePath + '.bak');
        });
    } else {
        changedFiles.forEach(filePath => {
            if (fs.existsSync(filePath + '.bak')) fs.unlinkSync(filePath + '.bak');
        });
        console.log('[DONE]: Admin now requires Username and Password.');
    }
}

// ЗАПУСК
createDump();
runTransformations();