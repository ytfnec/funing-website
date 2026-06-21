const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', '.open-next');

console.log('🔧 Post-processing .open-next for Cloudflare Pages...');

const workerJs = path.join(outputDir, 'worker.js');
const underscoreWorkerJs = path.join(outputDir, '_worker.js');
if (fs.existsSync(workerJs) && !fs.existsSync(underscoreWorkerJs)) {
  fs.renameSync(workerJs, underscoreWorkerJs);
  console.log('  ✅ Renamed worker.js → _worker.js');
} else if (fs.existsSync(underscoreWorkerJs)) {
  console.log('  ⏭️  _worker.js already exists');
}

// 移除 _worker.js 中 Pages 不支持的 Durable Objects 导出
let workerContent = fs.readFileSync(underscoreWorkerJs, 'utf-8');
const lines = workerContent.split('\n');
const filteredLines = lines.filter(line => {
  if (line.includes('DOQueueHandler') || line.includes('DOShardedTagCache') || line.includes('BucketCachePurge')) {
    return false;
  }
  return true;
});
fs.writeFileSync(underscoreWorkerJs, filteredLines.join('\n'));
console.log('  ✅ Removed Durable Object exports (not supported in Pages)');

const assetsDir = path.join(outputDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const entries = fs.readdirSync(assetsDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(assetsDir, entry.name);
    const dest = path.join(outputDir, entry.name);
    if (entry.isDirectory()) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      copyDirSync(src, dest);
      console.log(`  ✅ Copied assets/${entry.name}/ → .open-next/${entry.name}/`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`  ✅ Copied assets/${entry.name} → .open-next/${entry.name}`);
    }
  }
} else {
  console.log('  ⚠️  No assets/ directory found, skipping copy');
}

const routesJson = {
  version: 1,
  include: ['/*'],
  exclude: ['/_next/static/*', '/favicon.ico', '/robots.txt', '/BUILD_ID', '/logo.svg'],
};
fs.writeFileSync(path.join(outputDir, '_routes.json'), JSON.stringify(routesJson, null, 2));
console.log('  ✅ Created _routes.json');

console.log('\n✨ Post-processing complete!');

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) { copyDirSync(srcPath, destPath); }
    else { fs.copyFileSync(srcPath, destPath); }
  }
}
