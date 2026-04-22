const fs = require('fs');
const path = require('path');

// --- КОНФИГУРАЦИЯ ---
const DUMP_FILE = 'dump.txt';
const IGNORE_DIRS = ['node_modules', '.git', '.vercel', '.next'];
const IGNORE_FILES = [DUMP_FILE, 'setup.cjs', 'package-lock.json', 'struct.txt'];

/**
 * 1. ФУНКЦИЯ ОБНОВЛЕНИЯ DUMP.TXT
 */
function createDump() {
    console.log('\n[1/2] --- ОБНОВЛЕНИЕ DUMP.TXT ---');
    let dumpContent = '';
    const walk = (dir) => {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            const relPath = path.relative(process.cwd(), fullPath);
            if (fs.statSync(fullPath).isDirectory()) {
                if (!IGNORE_DIRS.includes(file)) walk(fullPath);
            } else if (!IGNORE_FILES.includes(file) && !file.endsWith('.bak')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                dumpContent += `\n// --- FILE_START: ${relPath} ---\n${content}\n// --- FILE_END: ${relPath} ---\n`;
            }
        });
    };
    walk(process.cwd());
    fs.writeFileSync(DUMP_FILE, dumpContent);
    console.log(`[DUMP]: Проект упакован в ${DUMP_FILE}`);
}

/**
 * 2. УМНАЯ ЗАМЕНА БЛОКОВ
 */
function smartReplace(filePath, anchor, replacement, description) {
    if (!fs.existsSync(filePath)) {
        console.log(`[FAIL]: ${description} (Файл не найден: ${filePath})`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Создаем регулярное выражение из якоря, игнорирующее пробелы, табы и переносы строк
    const escapedAnchor = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexStr = escapedAnchor.split(/\s+/).map(s => s + '\\s*').join('');
    const regex = new RegExp(regexStr, 'm');

    if (regex.test(content)) {
        // Если replacement содержит '$', используем функцию, чтобы избежать проблем с подстановкой
        const newContent = content.replace(regex, () => replacement);
        fs.writeFileSync(filePath, newContent);
        console.log(`[SUCCESS]: ${description}`);
    } else {
        console.log(`[SKIP]: ${description} (Якорь не найден)`);
    }
}

/**
 * 3. ПРИМЕНЕНИЕ ИСПРАВЛЕНИЙ
 */
function applyFixes() {
    console.log('\n[2/2] --- ИСПРАВЛЕНИЕ ОШИБОК ---');

    // Исправление 1: Добавляем аналитику и Sitemap в Router.js
    smartReplace(
        'core/Router.js',
        "const parsed = url.parse(req.url, true);",
        "const parsed = url.parse(req.url, true);\n    const analytics = require('./Analytics');\n    const sitemap = require('./Sitemap');\n    analytics.track(parsed.pathname);",
        "Интеграция Analytics.track в Router"
    );

    // Исправление 2: Добавляем роут для Sitemap
    smartReplace(
        'core/Router.js',
        "if (parsed.pathname === '/search' && method === 'GET')",
        "if (parsed.pathname === '/sitemap.xml') {\n        res.writeHead(200, { 'Content-Type': 'application/xml' });\n        return res.end(sitemap.generate(req.headers.host));\n    }\n\n    if (parsed.pathname === '/search' && method === 'GET')",
        "Добавление роута /sitemap.xml"
    );

    // Исправление 3: Безопасное чтение CSS
    smartReplace(
        'core/Router.js',
        "return res.end(fs.readFileSync(path.join(__dirname, '../public/style.css')));",
        "const cssPath = path.join(__dirname, '../public/style.css');\n        if (fs.existsSync(cssPath)) return res.end(fs.readFileSync(cssPath));\n        res.end('');",
        "Безопасный путь к style.css"
    );

    // Исправление 4: Обработка ошибок записи в Analytics (для Vercel)
    smartReplace(
        'core/Analytics.js',
        "fs.writeFileSync(LOG_FILE, JSON.stringify(stats, null, 2));",
        "try { fs.writeFileSync(LOG_FILE, JSON.stringify(stats, null, 2)); } catch(e) { console.warn('FS Write access denied'); }",
        "Защита записи аналитики (Vercel FS)"
    );

    // Исправление 5: Экспорт для Vercel в index.js
    smartReplace(
        'index.js',
        "module.exports = server;",
        "module.exports = (req, res) => { router(req, res); };",
        "Адаптация экспорта под Vercel Serverless"
    );
}

// ЗАПУСК
createDump();
applyFixes();