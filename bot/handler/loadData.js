// loadData.js
const fs = require('fs-extra');
const path = require('path');

async function loadJson(filePath) {
  if (!await fs.pathExists(filePath)) return null;
  return fs.readJson(filePath);
}

async function loadDataDir(dirPath = path.resolve('./data')) {
  const res = {};
  if (!await fs.pathExists(dirPath)) return res;
  const files = await fs.readdir(dirPath);
  for (const f of files) {
    const full = path.join(dirPath, f);
    if (f.endsWith('.json')) res[f] = await loadJson(full);
    else res[f] = await fs.readFile(full, 'utf8');
  }
  return res;
}

module.exports = { loadJson, loadDataDir };

// usage example
if (require.main === module) {
  (async()=>{
    console.log(await loadDataDir(process.env.DATA_DIR || './data'));
  })();
}
