
const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, '../data/stats.json');

module.exports = {
    track(url) {
        if (!fs.existsSync(path.dirname(LOG_FILE))) fs.mkdirSync(path.dirname(LOG_FILE));
        let stats = fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE)) : {};
        stats[url] = (stats[url] || 0) + 1;
        try { fs.writeFileSync(LOG_FILE, JSON.stringify(stats, null, 2)); } catch(e) { console.warn('FS Write access denied'); }},
    getStats() {
        return fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE)) : {};
    }
};