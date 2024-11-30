const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// 读取 Excel 文件并解析
function readExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // 假设第一个 sheet 是需要的内容
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

// 根据点分隔符创建嵌套对象
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    // 如果是第一个键（例如 tip），直接用它作为父键
    if (keys.length === 1) {
        obj[keys[0]] = value;
    } else {
        const [firstKey, ...restKeys] = keys;
        obj[firstKey] = obj[firstKey] || {}; // 创建顶层对象
        const nestedObj = obj[firstKey];
        setNestedValue(nestedObj, restKeys.join('.'), value); // 递归处理剩余的嵌套键
    }
}

// 处理字符串，避免双引号和单引号冲突
function formatString(value) {
    value = String(value); // 确保 value 是字符串

    if (value.includes('"')) {
        // 如果字符串中包含双引号，则使用单引号包裹
        return `'${value}'`; // 不转义内部双引号，直接用单引号包裹
    } else {
        // 否则使用双引号包裹
        return `"${value}"`; // 使用双引号包裹
    }
}

// 递归转换对象为 TypeScript 格式的字符串，避免键名带引号，并添加缩进
function formatObject(obj, indentLevel = 1) {
    const indent = '  '.repeat(indentLevel);  // 每一层缩进两个空格
    const entries = Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            return `${indent}${key}: ${formatObject(value, indentLevel + 1)}`;
        } else {
            return `${indent}${key}: ${formatString(value)}`; // 格式化字符串
        }
    });
    return `{\n${entries.join(',\n')}\n${'  '.repeat(indentLevel - 1)}}`;
}

// 将 Excel 数据转换为对应的 TypeScript 语言文件
function generateLangFiles(data, outputDir) {
    const langFiles = {}; // 存储各语言文件的内容

    // 假设 Excel 文件的第一列为键，后续列为不同语言的翻译
    const keys = Object.keys(data[0]).slice(1); // 语言列的标题（从第二列开始）

    // 初始化每个语言文件的内容
    keys.forEach((lang) => {
        langFiles[lang] = {};
    });

    // 遍历每一行数据，将翻译按语言分类
    data.forEach((row) => {
        const key = row[Object.keys(row)[0]]; // 获取每行的键（第一列）
        keys.forEach((lang, index) => {
            const value = row[Object.keys(row)[index + 1]]; // 获取对应语言的翻译
            setNestedValue(langFiles[lang], key, value); // 填充嵌套对象
        });
    });

    // 为每种语言生成 TypeScript 文件
    Object.keys(langFiles).forEach((lang) => {
        const content = `export default ${formatObject(langFiles[lang])};\n`;
        const filePath = path.join(outputDir, `${lang}.ts`);
        fs.writeFileSync(filePath, content);
        console.log(`Generated ${filePath}`);
    });
    console.info("翻译文件输出目录", outputDir)
}

// 主函数
function generateLanguageFilesFromExcel(excelFilePath, outputDir) {
    try {
        const data = readExcelFile(excelFilePath);
        generateLangFiles(data, outputDir);
    } catch (error) {
        console.error('Error generating language files:', error.message);
    }
}

// 使用示例
const excelFilePath = './Language_Merge.xlsx'; // Excel 文件路径
const outputDir = './output'; // 输出文件夹

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

generateLanguageFilesFromExcel(excelFilePath, outputDir);
