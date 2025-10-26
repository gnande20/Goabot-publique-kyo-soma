// getFbstate.js
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const axios = require('axios');
const fs = require('fs-extra');

async function getFbState(cookiePath = './cookies.json') {
  const result = { loggedIn: false, statusCode: null, html: null };
  if (!await fs.pathExists(cookiePath)) return result;

  const raw = await fs.readJson(cookiePath).catch(()=>null);
  if (!raw || !raw.cookies) return result;

  const jar = new CookieJar();
  for (const c of raw.cookies) {
    await jar.setCookie(`${c.key}=${c.value}; Domain=${c.domain}`, 'https://mbasic.facebook.com');
  }
  const client = wrapper(axios.create({ jar, withCredentials: true, timeout: 15000 }));

  try {
    const res = await client.get('https://mbasic.facebook.com/', { headers: { 'User-Agent': 'Mozilla/5.0' }});
    result.statusCode = res.status;
    result.html = res.data;
    result.loggedIn = /logout|Déconnexion|Log out|profil/i.test(res.data);
  } catch (e) {
    result.statusCode = e.response ? e.response.status : null;
  }
  return result;
}

module.exports = { getFbState };

// debug runner
if (require.main === module) {
  (async()=>{
    console.log(await getFbState(process.env.COOKIE_PATH || './cookies.json'));
  })();
}
