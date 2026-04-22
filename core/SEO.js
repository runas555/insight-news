
module.exports = {
    generateTags(article) {
        const base = `
            <meta name="robots" content="index, follow">
            <meta property="og:site_name" content="Insight News">
            <meta name="twitter:card" content="summary_large_image">
        `;
        if (!article) return base;

        const schema = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": article.title,
            "datePublished": article.date,
            "author": {"@type": "Person", "name": "Insight Editorial"},
            "description": article.content.substring(0, 160)
        };

        return base + `
            <meta name="description" content="${article.content.substring(0, 160)}">
            <meta property="og:title" content="${article.title}">
            <meta property="og:type" content="article">
            <script type="application/ld+json">${JSON.stringify(schema)}</script>
        `;
    }
};