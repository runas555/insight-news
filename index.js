
const http = require('http');
const db = require('./core/DB');
const router = require('./core/Router');

const PORT = process.env.PORT || 3000;

db.init();

const server = http.createServer(async (req, res) => {
    try {
        await router(req, res);
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('ASA System Error');
    }
});

server.listen(PORT, () => {
    console.log('--- ASA News Platform ---');
    console.log('Status: ACTIVE');
    console.log('URL: http://localhost:' + PORT);
});
// Export for Vercel Serverless
module.exports = server;