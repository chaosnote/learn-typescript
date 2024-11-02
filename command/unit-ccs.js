const fs = require('fs');
const { execSync } = require('child_process');
//
const model = require('./model');
//
// 留意!! 路徑需由 當前作業目錄 反推

try {
    execSync('npm i -D ../../dist/kernel-0.0.0-development.tgz', { cwd: './example/ccs', stdio: 'inherit' });
} catch (error) {
    console.error(`${error.message}`);
}

fs.rmSync(model.dir_dist, { recursive: true, force: true });