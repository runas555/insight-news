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

// --- СПИСОК ИСПРАВЛЕНИЙ ---

// Исправление пути админки и добавление robots.txt в Router.js
addReplacement(
    'core/Router.js',
    "if (parsed.pathname === '/vibe-gate' && method === 'GET')",
    "if (parsed.pathname === '/robots.txt') {\n        res.writeHead(200, { 'Content-Type': 'text/plain' });\n        return res.end('User-agent: *\\nAllow: /\\nSitemap: https://' + req.headers.host + '/sitemap.xml');\n    }\n\n    if (parsed.pathname === '/admin' && method === 'GET')",
    "Смена пути на /admin и добавление robots.txt"
);

// Передача статистики в админку (Router.js)
addReplacement(
    'core/Router.js',
    "return res.end(views.layout('Portal', views.adminPanel()));",
    "const stats = analytics.getStats();\n        return res.end(views.layout('Admin', views.adminPanel('', stats)));",
    "Передача данных статистики в AdminPanel"
);

// Исправление склеенной строки в Router.js
addReplacement(
    'core/Router.js',
    "analytics.track(parsed.pathname);const method = req.method;",
    "analytics.track(parsed.pathname);\n    const method = req.method;",
    "Исправление форматирования (разнос строк)"
);

// Обновление AdminPanel в Views.js (добавление вывода статистики)
addReplacement(
    'core/Views.js',
    "adminPanel(error = '') {",
    "adminPanel(error = '', stats = {}) {\n        const statsHtml = Object.entries(stats).map(([url, count]) => `<li><code>${url}</code>: <strong>${count}</strong></li>`).join('');",
    "Добавление логики обработки статистики в Views"
);

addReplacement(
    'core/Views.js',
    "<h2>Publishing Portal</h2>",
    "<h2>Publishing Portal</h2>\n                    <div class=\"stats-box\"><h3>Quick Stats</h3><ul>${statsHtml || '<li>No data yet</li>'}</ul></div>",
    "Визуальное добавление блока статистики в админку"
);

// Добавление стилей для статистики в style.css
addReplacement(
    'public/style.css',
    ".admin-card {",
    ".stats-box { background: var(--bg); padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border); }\n.stats-box h3 { margin-top: 0; font-size: 0.9rem; text-transform: uppercase; color: var(--muted); }\n.stats-box ul { list-style: none; padding: 0; margin: 0; font-size: 0.85rem; }\n.admin-card {",
    "Стили для блока статистики"
);


/**
 * 3. ИСПОЛНЕНИЕ С ТРАНЗАКЦИЕЙ
 */
function runTransformations() {
    console.log('\n--- [2/3] APPLYING CHANGES ---');
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
        console.log('[DONE]: System restored to original state.');
    } else {
        changedFiles.forEach(filePath => {
            if (fs.existsSync(filePath + '.bak')) fs.unlinkSync(filePath + '.bak');
        });
        console.log('[DONE]: All changes applied successfully. Backups cleared.');
    }
}

// ЗАПУСК
createDump();
runTransformations();