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