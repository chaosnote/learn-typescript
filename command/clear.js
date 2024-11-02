const fs = require('fs');
//
const model = require('./model');

// 刪除暫存資料夾

fs.rmSync(model.dir_dist, { recursive: true, force: true });
fs.rmSync(model.dir_temp, { recursive: true, force: true });
