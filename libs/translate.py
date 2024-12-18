import pandas as pd
from googletrans import Translator
print("正在翻译，请稍候...")
# 加载 Excel 文件
file_path = '../Language_Merge.xlsx'  # 将此替换为实际文件路径
output_file = '../Language_Merge_Translated.xlsx'
df = pd.read_excel(file_path)

# 初始化翻译器
translator = Translator()

# 定义翻译函数
def translate_to_urdu(text):
    if pd.notna(text):  # 确保文本不是 NaN
        translated = translator.translate(text, src='en', dest='bn')  # 翻译为乌尔都语
        return translated.text
    return text

# 应用翻译到 'ba' 列
df['bn'] = df['en'].apply(translate_to_urdu)

# 保存翻译后的文件
df.to_excel(output_file, index=False)

print("翻译完成！结果已保存到 {}".format(output_file))
import pandas as pd
from googletrans import Translator

# 加载 Excel 文件
file_path = 'Language_Merge.xlsx'  # 将此替换为实际文件路径
output_file = 'Language_Merge_Translated.xlsx'
df = pd.read_excel(file_path)

# 初始化翻译器
translator = Translator()

# 定义翻译函数
def translate_to_urdu(text):
    if pd.notna(text):  # 确保文本不是 NaN
        translated = translator.translate(text, src='en', dest='ur')  # 翻译为乌尔都语
        return translated.text
    return text

# 应用翻译到 'ba' 列
df['ba'] = df['en'].apply(translate_to_urdu)

# 保存翻译后的文件
df.to_excel(output_file, index=False)

print("翻译完成！结果已保存到 {}".format(output_file))
