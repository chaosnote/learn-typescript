//
const fs = require('fs');
const { execSync } = require('child_process');
//
const model = require('./model');

// 移除舊版本

fs.rmSync(model.dir_dist, { recursive: true, force: true });
fs.mkdirSync(model.dir_dist, { recursive: true });

fs.rmSync(model.dir_temp, { recursive: true, force: true });
fs.mkdirSync(model.dir_temp, { recursive: true });

try {
    execSync('tsc --project ./src') ;
    execSync(`uglifyjs-folder ${model.dir_temp}/js -x .js -eo ${model.dir_temp}/min`) ;
} catch (error) {
    console.error(`${error.message}`);
}