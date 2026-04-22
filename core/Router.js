
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
        return res.end(views.layout('Feed', views.articleList(articles)));
    }
    if (parsed.pathname === '/vibe' && method === 'GET') {
        return res.end(views.layout('Vibe Status', views.vibeDashboard()));
    }
    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        return res.end(views.layout(article.title, views.singleArticle(article)));
    }
    if (parsed.pathname === '/manage-portal' && method === 'GET') {
        return res.end(views.layout('Portal', views.adminPanel()));
    }
    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const p = new URLSearchParams(body);
            db.saveArticle({ title: p.get('title'), content: p.get('content'), category: 'News', date: new Date().toLocaleDateString() });
            res.writeHead(302, { Location: '/' });
            res.end();
        });
        return;
    }
    if (parsed.pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(fs.readFileSync(path.join(__dirname, '../public/style.css')));
    }
    res.writeHead(404);
    res.end('404');
};