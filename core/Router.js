
const url = require('url');
const db = require('./DB');
const views = require('./Views');
const analytics = require('./Analytics');
const sitemap = require('./Sitemap');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    const parsed = url.parse(req.url, true);
    const method = req.method;
    const host = req.headers.host;

    analytics.track(parsed.pathname);

    // SEO Files
    if (parsed.pathname === '/sitemap.xml') {
        res.writeHead(200, { 'Content-Type': 'application/xml' });
        return res.end(sitemap.generate(host));
    }
    if (parsed.pathname === '/robots.txt') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end(`User-agent: *\nAllow: /\nSitemap: https://${host}/sitemap.xml`);
    }

    // Static Assets
    if (parsed.pathname === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        return res.end(fs.readFileSync(path.join(__dirname, '../public/style.css')));
    }

    // Public Pages
    if (parsed.pathname === '/' && method === 'GET') {
        const articles = [...db.getArticles()].reverse();
        const html = views.layout('Global Insight', views.articleList(articles));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/article' && method === 'GET') {
        const article = db.getArticleById(parsed.query.id);
        if (!article) { res.writeHead(404); return res.end('Not Found'); }
        const html = views.layout(article.title, views.singleArticle(article), '', article);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    if (parsed.pathname === '/search' && method === 'GET') {
        const query = parsed.query.q || '';
        const results = db.search(query);
        const html = views.layout('Search: ' + query, views.articleList(results));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }

    // Hidden CMS (Unlisted in navigation)
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

    res.writeHead(404);
    res.end('404');
};