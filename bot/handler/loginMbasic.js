// loginMbasic.js
const axios = require('axios');
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const fs = require('fs-extra');

async function loginMbasic({ email, password, cookiePath = './cookies.json' } = {}) {
  if (!email || !password) {
    throw new Error('email and password required');
  }

  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true, timeout: 20000, headers: { 'User-Agent': 'Mozilla/5.0' }}));
  try {
    // GET login page
    const getRes = await client.get('https://mbasic.facebook.com/login');
    const $ = cheerio.load(getRes.data);
    const form = $('form').first();
    if (!form) throw new Error('Login form not found');

    const action = form.attr('action') || '/login';
    const inputs = {};
    form.find('input').each((i, el) => {
      const name = $(el).attr('name');
      if (!name) return;
      inputs[name] = $(el).val() || '';
    });

    // fill credentials into likely fields
    // common fields: email, pass
    if ('email' in inputs) inputs.email = email;
    else if ('email' in inputs || 'email' in form) inputs.email = email;
    if ('pass' in inputs) inputs.pass = password;
    else if ('password' in inputs) inputs.password = password;

    // POST login
    const postUrl = new URL(action, 'https://mbasic.facebook.com').href;
    const formParams = new URLSearchParams();
    for (const k of Object.keys(inputs)) formParams.append(k, inputs[k]);

    const postRes = await client.post(postUrl, formParams.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Referer: 'https://mbasic.facebook.com/login' },
      maxRedirects: 0,
      validateStatus: s => s >= 200 && s < 400
    });

    // After post, check if we are logged in by GET /
    const home = await client.get('https://mbasic.facebook.com/');
    const logged = /logout|Déconnexion|Log out|profil/i.test(home.data);

    // save cookies to cookiePath
    const cookies = [];
    const cookiesRaw = await jar.getCookies('https://mbasic.facebook.com').catch(()=>[]);
    for (const c of cookiesRaw) {
      cookies.push({ key: c.key, value: c.value, domain: c.domain, path: c.path, expires: c.expires });
    }
    await fs.writeJson(cookiePath, { savedAt: new Date().toISOString(), cookies }, { spaces: 2 });

    return { success: logged, cookiePath, cookiesCount: cookies.length };
  } catch (e) {
    return { success: false, error: e.message || e.toString() };
  }
}

module.exports = { loginMbasic };
