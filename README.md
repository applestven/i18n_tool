# explain 

## 将locals中的翻译文件合并成一个excel表

- 前置条件
    ./locals/en.ts
    ......

```bash
npm run excel 
```
## 将excel表分解成各个语言的翻译文件

- 前置条件
  ./Language_Merge.xlsx 

```bash
npm run ts 
```

输出目录为 `output`


## 以en.ts为模板 ，翻译其它语言
- 前置条件
  1.  ./locals/en.ts
  2. 安装python环境  pip install 

##  将i18Image 下面的图片，根据语言，生成对应的图片设置的config图片

- 前置条件
  1. /i18Image文件 夹下，有各个语言的文件夹 bn  文件夹存放图片
  2. 图片在各语言中命名规则一致
``` bash
npm run imgConfig
```
