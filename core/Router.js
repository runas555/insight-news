
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;

    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        return res.end(views.layout('Home', views.articleList(articles)));
    }
    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) return (res.writeHead(404), res.end('404'));
        return res.end(views.layout(article.title, views.singleArticle(article), '', article));
    }
    if (parsed.pathname === '/search' && method === 'GET') {
        const query = parsed.query.q || '';
        const results = db.search(query);
        return res.end(views.layout('Search: ' + query, views.articleList(results)));
    }
    if (parsed.pathname === '/manage-portal' && method === 'GET') {
        return res.end(views.layout('Portal', views.adminPanel()));
    }
    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            const p = new URLSearchParams(body);
            db.saveArticle({
                title: p.get('title'),
                content: p.get('content'),
                category: p.get('category') || 'General',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
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
    res.end('Not Found');
};