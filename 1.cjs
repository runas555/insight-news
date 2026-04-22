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

// --- ИСПРАВЛЕНИЯ ОШИБОК ---

// ИСПРАВЛЕНИЕ ГЛАВНОЙ ОШИБКИ: Дублирование переменной stats
addReplacement(
    'core/Router.js',
    "const stats = analytics.getStats(); const stats = analytics.getStats();",
    "const stats = analytics.getStats();",
    "Удаление дубликата переменной 'stats'"
);

// Исправление слипшегося экспорта
addReplacement(
    'core/Router.js',
    "auth=asa-admin');module.exports = async",
    "auth=asa-admin');\n\nmodule.exports = async",
    "Разделение checkAuth и module.exports"
);

// Исправление слипшегося метода и аналитики
addReplacement(
    'core/Router.js',
    "analytics.track(parsed.pathname); }const method = req.method;",
    "analytics.track(parsed.pathname);\n    }\n    const method = req.method;",
    "Разделение блока аналитики и переменной method"
);

// Исправление слипшегося закрытия блока /admin
addReplacement(
    'core/Router.js',
    "views.adminPanel('', stats)));}",
    "views.adminPanel('', stats)));\n    }",
    "Исправление форматирования блока /admin"
);

// Исправление логики ошибки в /api/add (чтобы вела на Login, если нет прав)
addReplacement(
    'core/Router.js',
    "if (!checkAuth(req)) {return res.end(views.layout('Portal', views.adminPanel('Invalid Security PIN'))); }",
    "if (!checkAuth(req)) {\n                return res.end(views.layout('Login', views.adminLogin('Unauthorized access')));\n            }",
    "Обновление проверки авторизации в /api/add"
);

/**
 * 3. ИСПОЛНЕНИЕ С ТРАНЗАКЦИЕЙ
 */
function runTransformations() {
    console.log('\n--- [2/3] APPLYING FIXES ---');
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
        // Регулярка для поиска с игнорированием пробелов
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
        console.log('[ROLLBACK]: Error detected. Restoring files to original state...');
        backups.forEach((content, filePath) => {
            fs.writeFileSync(filePath, content);
            if (fs.existsSync(filePath + '.bak')) fs.unlinkSync(filePath + '.bak');
        });
        console.log('[DONE]: Rollback complete.');
    } else {
        changedFiles.forEach(filePath => {
            if (fs.existsSync(filePath + '.bak')) fs.unlinkSync(filePath + '.bak');
        });
        console.log('[DONE]: All fixes applied successfully.');
    }
}

// ЗАПУСК
createDump();
runTransformations();