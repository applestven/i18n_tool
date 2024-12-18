const fs = require('fs');
const path = require('path');

/**
 * 生成图片配置 JSON 文件
 * @param {string} basePath 图片的基础路径，例如 "/public/i18Image/"
 * @param {string} folderPath i18Image 文件夹的实际路径
 * @returns {object} 配置 JSON 对象
 */
function generateImageConfig(basePath = "/public/i18Image/", folderPath = "./i18Image") {
    const config = {};

    // 读取 i18Image 文件夹下的所有语言目录
    const languages = fs.readdirSync(folderPath).filter((lang) =>
        fs.statSync(path.join(folderPath, lang)).isDirectory()
    );

    // 遍历每个语言目录
    languages.forEach((lang) => {
        const langPath = path.join(folderPath, lang);

        // 获取语言目录下的所有图片文件
        const images = fs.readdirSync(langPath).filter((file) =>
            /\.(png|jpg|jpeg|gif|webp)$/i.test(file) // 仅匹配图片文件
        );

        images.forEach((image) => {
            const imageName = path.parse(image).name; // 获取不带扩展名的文件名

            // 初始化配置对象
            if (!config[imageName]) {
                config[imageName] = {};
            }

            // 使用 POSIX 路径
            config[imageName][lang] = path.posix.join(basePath, lang, image);
        });
    });

    return config;
}

// 使用方法
const outputPath = path.join(__dirname, "../i18ImageConfig.json"); // JSON 输出路径
const config = generateImageConfig("/public/i18Image/", path.join(__dirname, "../i18Image"));

// 保存到文件
fs.writeFileSync(outputPath, JSON.stringify(config, null, 2), "utf8");
console.log("配置 JSON 文件已生成:", outputPath);
