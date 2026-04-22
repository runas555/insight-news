
const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, '../data/articles.json');

module.exports = {
    init() {
        if (!fs.existsSync(path.dirname(DB_FILE))) fs.mkdirSync(path.dirname(DB_FILE));
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify([
                { id: 1, title: 'Future of ASA Architecture', content: 'Node.js raw performance is key...', date: '2023-10-27', category: 'Tech' },
                { id: 2, title: 'Clean UI Design Trends', content: 'Minimalism and bottom tabs for mobile...', date: '2023-10-26', category: 'Design' }
            ]));
        }
    },
    getArticles() { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); },
    saveArticle(art) {
        const data = this.getArticles();
        art.id = Date.now();
        data.push(art);
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    }
};