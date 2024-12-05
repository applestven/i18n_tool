const { exec } = require('child_process');
const path = require('path');

exec(`python ${path.resolve(__dirname, './translate.py')}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
