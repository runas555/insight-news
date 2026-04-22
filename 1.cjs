/**
 * FINAL_DIAGNOSTIC.CJS - Проверка верификации проекта
 * Если OAuth подтвержден, но проект не виден, проблема в одной из этих 4 деталей:
 */

const fs = require('fs');
const { execSync } = require('child_process');

const USER = "runas555";
const REPO = "insight-daily-platform";

function runDiagnostic() {
    console.log("\x1b[36m--- ЗАПУСК ДИАГНОСТИКИ ВЕРИФИКАЦИИ ---\x1b[0m\n");

    // 1. Проверка файла .vibetalent (самая частая ошибка - лишние пробелы или невидимые символы)
    if (fs.existsSync('.vibetalent')) {
        const content = fs.readFileSync('.vibetalent', 'utf8').trim();
        if (content === USER) {
            console.log("\x1b[32m[OK]\x1b[0m Файл .vibetalent корректен (содержит только '" + USER + "')");
            // Перезаписываем на всякий случай без лишних байтов (BOM/пробелов)
            fs.writeFileSync('.vibetalent', USER, 'utf8');
        } else {
            console.log("\x1b[31m[FAIL]\x1b[0m В файле .vibetalent написано '" + content + "', а должно быть '" + USER + "'");
            fs.writeFileSync('.vibetalent', USER, 'utf8');
        }
    } else {
        console.log("\x1b[31m[FAIL]\x1b[0m Файл .vibetalent отсутствует в корневой папке!");
        fs.writeFileSync('.vibetalent', USER, 'utf8');
    }

    // 2. Проверка ветки (VibeTalent ищет в 'main')
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
        if (branch === 'main') {
            console.log("\x1b[32m[OK]\x1b[0m Вы находитесь в ветке 'main'");
        } else {
            console.log("\x1b[33m[WARN]\x1b[0m Ваша ветка '" + branch + "'. Платформа может требовать 'main'.");
            console.log("      Выполните: git branch -M main");
        }
    } catch (e) {
        console.log("\x1b[31m[FAIL]\x1b[0m Git не инициализирован.");
    }

    // 3. Проверка публичности репозитория (САМОЕ ВАЖНОЕ)
    console.log("\n\x1b[33mПРОКЕРЬТЕ ЭТИ ПУНКТЫ ВРУЧНУЮ:\x1b[0m");
    console.log("1. \x1b[1mПубличность:\x1b[0m Репозиторий на GitHub должен быть PUBLIC. Если он Private, платформа его не увидит.");
    console.log("2. \x1b[1mURL на сайте:\x1b[0m Зайдите в настройки проекта на VibeTalent.");
    console.log("   Ссылка должна быть строго: \x1b[36mhttps://github.com/" + USER + "/" + REPO + "\x1b[0m");
    console.log("3. \x1b[1mСинхронизация:\x1b[0m После пуша файла .vibetalent подождите 1-2 минуты (кэш GitHub API).");

    // 4. Финальный пуш (инструкция)
    console.log("\n\x1b[35mИНСТРУКЦИЯ ДЛЯ ФИНАЛЬНОГО ПУША:\x1b[0m");
    console.log("git add .vibetalent package.json");
    console.log("git commit -m 'fix: verification file content'");
    console.log("git push origin main");

    console.log("\n\x1b[36m--------------------------------------\x1b[0m");
}

runDiagnostic();