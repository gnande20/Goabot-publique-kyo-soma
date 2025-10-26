// getFbstate1.js
const { getFbState } = require('./getFbstate');
const cheerio = require('cheerio');

async function getFbStateDetailed(cookiePath = './cookies.json') {
  const base = await getFbState(cookiePath);
  if (!base.html) return base;

  const $ = cheerio.load(base.html);
  const name = $('title').text().trim() || $('a[href*="profile.php"]').first().text().trim();
  return { ...base, profileName: name || null };
}

module.exports = { getFbStateDetailed };

if (require.main === module) {
  (async()=> console.log(await getFbStateDetailed(process.env.COOKIE_PATH || './cookies.json')))();
}
