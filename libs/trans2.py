import pandas as pd
from googletrans import Translator

# 原始Markdown文件路径
input_file = "input.md"
output_file = "output.md"

# 读取Markdown文件为DataFrame
def read_markdown_table(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()
    table = [line.strip().split('|')[1:-1] for line in lines[2:]]  # 跳过表头和分隔行
    headers = [h.strip() for h in lines[0].strip().split('|')[1:-1]]
    return pd.DataFrame(table, columns=headers)

# 写回Markdown文件
def write_markdown_table(df, file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        file.write("| " + " | ".join(df.columns) + " |\n")
        file.write("|" + "|".join(["-" * (len(col) + 2) for col in df.columns]) + "|\n")
        for _, row in df.iterrows():
            file.write("| " + " | ".join(row) + " |\n")

# 初始化翻译器
translator = Translator()

# 翻译函数
def translate_text(text, src="en", dest="bn"):
    if not text.strip():
        return ""
    translated = translator.translate(text, src=src, dest=dest)
    return translated.text

# 主函数
def main():
    # 读取原始Markdown表格
    df = read_markdown_table(input_file)
    
    # 翻译 `en` 列到 `ba`
    df['ba'] = df['en'].apply(lambda x: translate_text(x, src="en", dest="bn"))
    
    # 写回Markdown文件
    write_markdown_table(df, output_file)
    print("翻译完成，已保存到 {output_file}")

if __name__ == "__main__":
    main()
