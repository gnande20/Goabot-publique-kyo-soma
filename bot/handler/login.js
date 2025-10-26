// login.js
const { loginMbasic } = require('./loginMbasic');
const { isCookieLive } = require('./checkLiveCookie');

async function login(options = {}) {
  const cookiePath = options.cookiePath || './cookies.json';
  // si cookie existant valide -> retourne success et cookie path
  const live = await isCookieLive(cookiePath);
  if (live) {
    return { success: true, cookiePath, reusedCookie: true };
  }
  // fallback: login via mbasic
  return loginMbasic(options);
}

module.exports = { login };

// run
if (require.main === module) {
  (async()=>{
    const out = await login({ email: process.env.FB_EMAIL, password: process.env.FB_PASSWORD, cookiePath: process.env.COOKIE_PATH || './cookies.json' });
    console.log(out);
  })();
}
