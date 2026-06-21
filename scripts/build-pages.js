const fs = require('fs');
const path = require('path');
const outputDir = path.join(__dirname, '..', '.open-next');
console.log('🔧 Post-processing .open-next for Cloudflare Pages...');
const workerJs = path.join(outputDir, 'worker.js');
const underscoreWorkerJs = path.join(outputDir, '_worker.js');
if (fs.existsSync(workerJs)) {
  fs.renameSync(workerJs, underscoreWorkerJs);
  console.log('  ✅ Renamed worker.js → _worker.js');
} else if (fs.existsSync(underscoreWorkerJs)) {
  console.log('  ⏭️  _worker.js already exists');
}
const assetsDir = path.join(outputDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const entries = fs.readdirSync(assetsDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(assetsDir, entry.name);
    const dest = path.join(outputDir, entry.name);
    if (!fs.existsSync(dest)) {
      if (entry.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        copyDirSync(src, dest);
      } else {
        fs.copyFileSync(src, dest);
      }
    }
  }
}
const routesJson = { version: 1, include: ['/*'], exclude: ['/_next/static/*', '/favicon.ico', '/robots.txt', '/BUILD_ID'] };
fs.writeFileSync(path.join(outputDir, '_routes.json'), JSON.stringify(routesJson, null, 2));
console.log('✨ Post-processing complete!');

function copyDirSync(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const sp = path.join(src, entry.name);
    const dp = path.join(dest, entry.name);
    if (entry.isDirectory()) { fs.mkdirSync(dp, { recursive: true }); copyDirSync(sp, dp); }
    else { fs.copyFileSync(sp, dp); }
  }
}
