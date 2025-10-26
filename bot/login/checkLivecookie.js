// checkLiveCookie.js
const fs = require('fs-extra');
const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

async function isCookieLive(cookiePath = './cookies.json') {
  if (!await fs.pathExists(cookiePath)) return false;

  const jar = new CookieJar();
  const raw = await fs.readJson(cookiePath).catch(()=>null);
  if (!raw || !raw.cookies) return false;

  // restore cookies to jar
  for (const c of raw.cookies) {
    await jar.setCookie(`${c.key}=${c.value}; Domain=${c.domain}`, 'https://mbasic.facebook.com');
  }

  const client = wrapper(axios.create({ jar, withCredentials: true, timeout: 15000 }));
  try {
    const res = await client.get('https://mbasic.facebook.com/', { headers: { 'User-Agent': 'Mozilla/5.0' }});
    const html = res.data;
    // simple heuristic: presence of "Déconnexion" / "Log Out" / profile link
    return /logout|Déconnexion|Log out|profil/i.test(html);
  } catch (e) {
    return false;
  }
}

module.exports = { isCookieLive };

// Usage if run directly
if (require.main === module) {
  (async()=>{
    const live = await isCookieLive(process.env.COOKIE_PATH || './cookies.json');
    console.log('cookie live:', live);
  })();
}
