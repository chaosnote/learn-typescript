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

/**
 * 刪除資料夾並排除指定的檔案
 * @param {string} dirPath - 要刪除的資料夾路徑
 * @param {Object} excludeFiles - 要排除的檔案 (關聯陣列)
 */
async function deleteFolderWithExclusions(dirPath, excludeFiles) {
    try {
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.promises.stat(filePath);

            // 如果是資料夾，進行遞迴刪除
            if (stat.isDirectory()) {
                await deleteFolderWithExclusions(filePath, excludeFiles);
            } else {
                // console.log(filePath) ;
                // 如果是檔案且不在排除清單中，刪除它
                if (!excludeFiles[filePath]) {
                    await fs.promises.unlink(filePath);
                }
            }
        }

        // 刪除空資料夾（如果資料夾中的檔案已經全部刪除）
        const remainingFiles = await fs.promises.readdir(dirPath);
        if (remainingFiles.length === 0) {
            await fs.promises.rmdir(dirPath);
        }
    } catch (error) {
        console.error(`Error while deleting folder: ${error.message}`);
    }
}

const excludeFiles = {
    "dist\\kernel-0.0.0-development.tgz": true,
};

deleteFolderWithExclusions('./dist', excludeFiles)
    .then(() => console.log('指定資料夾已成功刪除並排除特定檔案'))
    .catch(console.error);