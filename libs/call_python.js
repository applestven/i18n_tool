const { spawn } = require('child_process');
const path = require('path');

// 使用 python3 代替 python（根据 Python 安装方式）
const pythonProcess = spawn('python', [path.resolve(__dirname, './translate.py')]);

pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
});