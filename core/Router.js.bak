
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;

    if (parsed.pathname === '/' && method === 'GET') {
        const articles = db.getArticles();
        const html = views.layout('Global News', views.articleList(articles));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/admin' && method === 'GET') {
        const html = views.layout('Admin Console', views.adminPanel());
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const params = new URLSearchParams(body);
            db.saveArticle({
                title: params.get('title'),
                content: params.get('content'),
                category: params.get('category'),
                date: new Date().toISOString().split('T')[0]
            });
            res.writeHead(302, { Location: '/' });
            res.end();
        });
        return;
    }

    if (parsed.pathname === '/style.css') {
        const css = fs.readFileSync(path.join(__dirname, '../public/style.css'));
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(css);
    }

    res.writeHead(404);
    res.end('Not Found');
};