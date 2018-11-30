# jsonConv
Convent Javascript Object define string to JSON without eval

Usefull link https://www.jianshu.com/p/838f69db2f71

将 Javascript 对象定义的字符串，不通过 eval 方法，转换为 JSON 标准字符串
eg:
{name: 'sloan', age: 13, 'info': {work: true, }, fav: ['coding', "drive"], }
->
{"name":"sloan","age":13,"info":{"work":true},"fav":["coding","drive"]}
