
module.exports = {
    layout(title, content, head = '') {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Advanced Node News Hub">
    <title>${title} | ASA News</title>
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    ${head}
</head>
<body>
    <header>
        <nav class="desktop-nav">
            <div class="logo">ASA News</div>
            <ul><li><a href="/">Home</a></li><li><a href="/admin">Admin</a></li></ul>
        </nav>
    </header>
    <main>${content}</main>
    <div class="mobile-tabs">
        <a href="/"><i class="fas fa-home"></i><span>Home</span></a>
        <a href="/discover"><i class="fas fa-search"></i><span>Discover</span></a>
        <a href="/admin"><i class="fas fa-user-shield"></i><span>Admin</span></a>
    </div>
</body>
</html>`;
    },
    articleList(articles) {
        return articles.map(a => `
            <article class="card">
                <h2>${a.title}</h2>
                <p>${a.content.substring(0, 100)}...</p>
                <div class="meta"><span>${a.date}</span><span>${a.category}</span></div>
                <a href="/article?id=${a.id}" class="btn">Read More</a>
            </article>`).join('');
    },
    adminPanel() {
        return `
            <section class="admin-form">
                <h1>Post New Article</h1>
                <form action="/api/add" method="POST">
                    <input name="title" placeholder="Title" required>
                    <textarea name="content" placeholder="Content text" required></textarea>
                    <input name="category" placeholder="Category">
                    <button type="submit">Publish</button>
                </form>
            </section>`;
    }
};