
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const analytics = require('./Analytics');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;

    analytics.track(parsed.pathname);

    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        const html = views.layout('Fresh Feed', views.articleList(articles));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) { res.writeHead(404); return res.end('404'); }
        const html = views.layout(article.title, views.singleArticle(article), '', article);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/search' && method === 'GET') {
        const query = parsed.query.q || '';
        const results = db.search(query);
        const html = views.layout('Explore: ' + query, views.articleList(results));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/api/subscribe' && method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true }));
    }

    if (parsed.pathname === '/manage-portal' && method === 'GET') {
        const html = views.layout('CMS Access', views.adminPanel());
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/api/add' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const p = new URLSearchParams(body);
            db.saveArticle({
                title: p.get('title'),
                content: p.get('content'),
                category: p.get('category'),
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
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