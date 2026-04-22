
module.exports = {
    generateTags(article) {
        if (!article) return `
            <meta name="robots" content="index, follow">
            <meta property="og:type" content="website">
            <meta property="og:title" content="ASA News - Modern Architecture">
            <meta property="og:description" content="The fastest news delivery system built on Node.js">
        `;
        return `
            <meta name="description" content="${article.content.substring(0, 150)}">
            <meta property="og:title" content="${article.title}">
            <meta property="og:description" content="${article.content.substring(0, 100)}">
            <meta property="og:type" content="article">
            <meta name="keywords" content="${article.category}, news, tech">
        `;
    }
};