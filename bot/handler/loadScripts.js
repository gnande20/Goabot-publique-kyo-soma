// loadScripts.js
const fs = require('fs-extra');
const path = require('path');

async function loadScriptsFrom(dir = path.resolve('./scripts')) {
  const result = {};
  if (!await fs.pathExists(dir)) return result;
  const files = (await fs.readdir(dir)).filter(f => f.endsWith('.js'));
  for (const f of files) {
    try {
      const full = path.join(dir, f);
      // require fresh (clear cache)
      delete require.cache[require.resolve(full)];
      result[f] = require(full);
      console.log('Loaded', f);
    } catch (e) {
      console.error('Error loading', f, e.message);
    }
  }
  return result;
}

module.exports = { loadScriptsFrom };
