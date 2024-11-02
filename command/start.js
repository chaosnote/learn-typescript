const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
//
const model = require('./model');
//
let file_path = `${model.dir_temp}/min/index.min.js`;

function copyFolderSync(from, to) {
    console.log(`from: ${from}, to: ${to}`)
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }

    const items = fs.readdirSync(from);

    items.forEach(item => {
        const srcPath = path.join(from, item);
        const distPath = path.join(to, item);

        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            copyFolderSync(srcPath, distPath);
        } else {
            fs.copyFileSync(srcPath, distPath);
        }
    });
}

copyFolderSync(`${model.dir_temp}/min`, `${model.dir_dist}`)
copyFolderSync(`${model.dir_temp}/types`, `${model.dir_dist}`)

// copy files

file_path = `${model.dir_asset}/package.json`;
dist_path = `${model.dir_dist}/package.json`;
fs.copyFileSync(file_path, dist_path);

file_path = `${model.dir_asset}/.npmignore`;
dist_path = `${model.dir_dist}/.npmignore`;
fs.copyFileSync(file_path, dist_path);

fs.rmSync(`${model.dir_temp}`, { recursive: true, force: true });

try {
    execSync('npm pack', { cwd: `${model.dir_dist}`, stdio: 'inherit' });
} catch (error) {
    console.error(`${error.message}`);
}