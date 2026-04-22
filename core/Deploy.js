
/**
 * CORE/DEPLOY.JS - Vercel Environment Detection
 */
module.exports = {
    isProd: process.env.NODE_ENV === 'production',
    getDomain: (req) => req.headers['x-forwarded-host'] || req.headers.host
};