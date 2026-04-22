const fs = require('fs');
const path = require('path');

// --- КОНФИГУРАЦИЯ ---
const DUMP_FILE = 'dump.txt';
const IGNORE_DIRS = ['node_modules', '.git', '.vercel', '.next'];
const IGNORE_FILES = [DUMP_FILE, 'setup.cjs', 'package-lock.json', 'struct.txt'];

/**
 * 1. СБОР ДАННЫХ В DUMP.TXT
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
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    dumpContent += `\n// --- FILE_START: ${relPath} ---\n${content}\n// --- FILE_END: ${relPath} ---\n`;
                } catch (e) {}
            }
        });
    };
    walk(process.cwd());
    fs.writeFileSync(DUMP_FILE, dumpContent);
    console.log(`[DUMP]: Файл ${DUMP_FILE} обновлен`);
}

/**
 * 2. УМНАЯ ЗАМЕНА С ЯКОРЯМИ
 */
function smartReplace(filePath, anchor, replacement, description) {
    if (!fs.existsSync(filePath)) {
        console.log(`[FAIL]: ${description} (Файл ${filePath} не найден)`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Экранируем символы и создаем гибкую регулярку (игнор пробелов и переносов)
    const escapedAnchor = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regexStr = escapedAnchor.split(/\s+/).filter(s => s.length > 0).map(s => s + '\\s*').join('');
    const regex = new RegExp(regexStr, 'm');

    if (regex.test(content)) {
        const newContent = content.replace(regex, () => replacement);
        fs.writeFileSync(filePath, newContent);
        console.log(`[SUCCESS]: ${description}`);
    } else {
        console.log(`[SKIP]: ${description} (Якорь не найден)`);
    }
}

/**
 * 3. ПЕРЕДЕЛКА ПРОЕКТА (УДАЛЕНИЕ ПУБЛИЧНОЙ АДМИНКИ)
 */
function redoEverything() {
    console.log('\n[2/2] --- ПЕРЕДЕЛКА ИНТЕРФЕЙСА ---');

    // 1. Скрываем вход в админку из мобильного меню (Views.js)
    smartReplace(
        'core/Views.js',
        `<a href="/manage-portal"><i class="fas fa-user-circle"></i><span>Portal</span></a>`,
        `<a href="/search?q=Tech"><i class="fas fa-microchip"></i><span>Tech</span></a>`,
        "Удаление ссылки на Портал из мобильного меню"
    );

    // 2. Делаем главную страницу более чистой (убираем лишние упоминания)
    smartReplace(
        'core/Views.js',
        `<div class="logo"><a href="/">Insight<span>News</span></a></div>`,
        `<div class="logo"><a href="/">Insight<span>Daily</span></a></div>`,
        "Ребрендинг в Insight Daily"
    );

    // 3. Изменяем роут админки на секретный (Router.js)
    smartReplace(
        'core/Router.js',
        "parsed.pathname === '/manage-portal'",
        "parsed.pathname === '/vibe-gate'", // Секретный вход
        "Скрытие URL админки (теперь /vibe-gate)"
    );

    // 4. Улучшаем CSS для более премиального вида заголовков
    smartReplace(
        'public/style.css',
        ".featured-block h1 { font-family: 'Playfair Display', serif; font-size: 4rem; line-height: 1; margin: 0 0 24px; }",
        ".featured-block h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 8vw, 4.5rem); line-height: 0.95; margin: 0 0 24px; letter-spacing: -2px; }",
        "Обновление типографики заголовков"
    );

    // 5. Добавляем "плавное появление" для всех ссылок
    smartReplace(
        'public/style.css',
        "a { text-decoration: none; color: inherit; }",
        "a { text-decoration: none; color: inherit; transition: opacity 0.2s; }\na:hover { opacity: 0.7; }",
        "Добавление эффектов наведения"
    );
}

// ЗАПУСК
createDump();
redoEverything();