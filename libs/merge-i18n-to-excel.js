const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

/**
 * 读取并解析语言文件内容
 * @param {string} filePath 文件路径
 * @returns {object} 语言文件解析后的对象
 */
const ts = require("typescript");

function readLangFile(filePath) {
    let content;
    try {
        // 读取文件内容
        content = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error.message);
        return null;
    }

    try {
        // 将 TypeScript 内容转为 CommonJS 格式的 JavaScript
        const jsContent = ts.transpileModule(content, {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES5  // 强制转换为 ES5 兼容代码，避免某些新特性错误
            },
        }).outputText;

        // 使用 eval 执行并返回导出的对象
        const result = eval(jsContent); // 注意：eval 的安全风险
        return result;
    } catch (error) {
        console.error(`Error parsing file content at ${filePath}:`, error.message);
        return null;
    }
}


/**
 * 将嵌套对象扁平化
 * @param {object} obj 要扁平化的对象
 * @param {string} parentKey 父级键名
 * @param {object} result 结果对象
 * @returns {object} 扁平化后的对象
 */
function flattenObject(obj, parentKey = "", result = {}) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
                flattenObject(obj[key], newKey, result);
            } else {
                result[newKey] = obj[key];
            }
        }
    }
    return result;
}

/**
 * 合并语言数据并生成 Excel 文件
 */
function mergeLangFilesToExcel() {
    const langDir = path.resolve(__dirname, "..", "./locales"); // 语言文件目录
    let langFiles = fs.readdirSync(langDir); // 获取目录中的文件列表

    const data = {};
    const languages = [];

    // 去除 langFiles 中的 i18n.ts
    langFiles = langFiles.filter(file => file !== 'i18n.ts');

    // 读取和解析每个语言文件
    for (const file of langFiles) {
        const langCode = path.basename(file, path.extname(file)); // 获取语言代码
        languages.push(langCode);
        const langData = readLangFile(path.join(langDir, file)); // 读取语言文件
        data[langCode] = flattenObject(langData); // 扁平化数据
    }

    // 准备 Excel 数据
    const rows = [];
    const headers = ["Key", ...languages]; // 表头
    rows.push(headers);

    // 收集所有语言的键
    const allKeys = new Set();
    for (const langCode of languages) {
        Object.keys(data[langCode]).forEach((key) => allKeys.add(key));
    }

    // 根据键生成每行数据
    for (const key of allKeys) {
        const row = [key];
        for (const langCode of languages) {
            row.push(data[langCode][key] || ""); // 没有值时填空
        }
        rows.push(row);
    }

    // 创建 Excel 工作簿
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(rows); // 将数据转为工作表
    xlsx.utils.book_append_sheet(workbook, worksheet, "Languages");

    // 导出 Excel 文件
    const outputFile = path.resolve(__dirname, "..", "Language_Merge.xlsx");
    xlsx.writeFile(workbook, outputFile);

    console.log(`语言数据已合并到 Excel 文件：${outputFile}`);
}

// 执行合并
mergeLangFilesToExcel();
