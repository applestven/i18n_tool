const fs = require('fs');
const path = require('path');

// 遍历目录并生成对应的 Markdown 目录结构
function generateDirectoryMarkdown(dirPath, depth = 0) {
    const markdownLines = [];
    const indent = '  '.repeat(depth); // 根据深度设置缩进

    try {
        // 读取目录中的文件和子目录
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // 如果是目录，则在 markdown 中以标题形式表示，并递归调用
                markdownLines.push(`${indent}- **${file}**/`);
                // 递归遍历子目录
                markdownLines.push(generateDirectoryMarkdown(filePath, depth + 1));
            } else if (stat.isFile()) {
                // 如果是文件，则以列表形式列出
                markdownLines.push(`${indent}- ${file}`);
            }
        });
    } catch (err) {
        console.error(`Error reading directory ${dirPath}:`, err.message);
    }

    return markdownLines.join('\n');
}

// 主函数
function generateMarkdownForDirectory(directoryPath, outputFile) {
    try {
        // 确保是一个目录
        const stat = fs.statSync(directoryPath);
        if (!stat.isDirectory()) {
            throw new Error(`${directoryPath} is not a valid directory.`);
        }

        const markdownContent = generateDirectoryMarkdown(directoryPath);

        // 将结果写入文件
        fs.writeFileSync(outputFile, `# 目录结构\n\n${markdownContent}`);
        console.log(`Directory structure has been saved to ${outputFile}`);
    } catch (error) {
        console.error('Error generating markdown:', error.message);
    }
}

// 使用示例
const directoryPath = path.join(__dirname, '..'); // 需要生成目录结构的路径
const outputFile = path.join(__dirname, './catalogue.md'); // 输出 Markdown 文件路径

generateMarkdownForDirectory(directoryPath, outputFile);
