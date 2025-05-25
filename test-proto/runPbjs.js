const { exec } = require('child_process');

// 確保提供了 gameid 參數
const gameId = process.argv[2];  // 從命令行參數獲取 gameid
if (!gameId) {
    console.error("請提供 gameid 參數！");
    process.exit(1);
}

// 構造 pbjs 命令，並將 %gameid% 替換為提供的值
const command = `pbjs --dependency protobufjs/minimal.js --target static-module --wrap commonjs -p ./source --out ./dist/game_${gameId}/game_pb.js ./source/game_${gameId}.proto`;

console.log(`執行命令：${command}`);

// 執行命令
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`執行錯誤: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`標準錯誤: ${stderr}`);
        return;
    }
    console.log(`輸出: ${stdout}`);
});
