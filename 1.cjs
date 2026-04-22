const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build'];
const IGNORE_FILES = ['dump.txt', 'setup.cjs', 'package-lock.json'];

// Функция для создания дампа проекта
function generateDump() {
    let dumpContent = '';
    
    function walk(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const relativePath = path.relative(process.cwd(), fullPath);
            
            if (IGNORE_DIRS.some(d => relativePath.includes(d))) continue;
            if (IGNORE_FILES.includes(file)) continue;

            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else {
                const content = fs.readFileSync(fullPath, 'utf8');
                dumpContent += `\n--- FILE: ${relativePath} ---\n${content}\n`;
            }
        }
    }

    walk(process.cwd());
    fs.writeFileSync('dump.txt', dumpContent);
    console.log('✅ [SUCCESS] dump.txt обновлен');
}

// Функция для умной замены блоков
function replaceInFile(filePath, anchorText, newContent) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ [FAIL] Файл не найден: ${filePath}`);
        return;
    }

    let fileContent = fs.readFileSync(filePath, 'utf8');

    // Экранируем спецсимволы и превращаем все пробелы/переносы в \s*
    const escapedAnchor = anchorText
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s*');
    
    const regex = new RegExp(escapedAnchor, 'g');

    if (regex.test(fileContent)) {
        // Если нашли, заменяем. В данном случае мы заменяем найденный блок на новый контент
        const updatedContent = fileContent.replace(regex, newContent);
        fs.writeFileSync(filePath, updatedContent);
        console.log(`✅ [SUCCESS] Блок заменен в файле: ${filePath}`);
    } else {
        console.log(`❌ [FAIL] Не удалось найти блок в файле: ${filePath}`);
        // Вывод для отладки: что именно искали (первые 30 символов)
        console.log(`   Искали: "${anchorText.substring(0, 50).trim()}..."`);
    }
}

// --- ОБРАБОТКА КОМАНД ---
const mode = process.argv[2];

if (mode === 'dump') {
    generateDump();
} else if (mode === 'apply') {
    // Сюда будем добавлять команды на замену в следующих шагах
    console.log('🚀 Начинаю применение правок...');
    
    // ПРИМЕР ИСПОЛЬЗОВАНИЯ (будет заполняться далее):
    // replaceInFile('src/index.js', 'const x = 10', 'const x = 20');
} else {
    console.log('Использование: node setup.cjs [dump|apply]');
}