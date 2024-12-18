## [i18n多语言图片匹配开发与配置](https://blog.itclass.top/%E5%89%8D%E7%AB%AF/i18n%E9%97%AE%E9%A2%98.html) 

## 翻译说明

1. 需要将 "项目图片需要翻译原件" 文件夹下的图片文件进行语种转换 

## 文件夹说明 

"bn" 是孟加拉语图片存放地址  "en" 是英语 

## 取名规则 

1. 同一组图片（英语或孟加拉语） 存放在 "bn" 或者其它语种文件夹下 图片名称必须一致 

2. 同时保持原文件名

## 实现快速形成配置图片的json文件

文件夹结构 

-- i18Image
    -- bn
      - btnv2_reg_enable.png
    -- en
      - btnv2_reg_enable.png
1. 需要读取i18Image下所有的文件夹 "bn" "en"
2. 读取"en"文件夹下的所有图片
3. "/public/i18Image/"为参数填写路径 设为默认路径

最终形成json文件
``` json
{
  "btnv2_reg_enable": {
    "en": "/public/i18Image/en/btnv2_reg_enable.png",
    "bn": "/public/i18Image/bn/btnv2_reg_enable.png"
  }
}
```

