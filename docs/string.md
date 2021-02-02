---
order: 3
---
## 字符串

### 遍历器接口
ES6 为字符串添加了遍历器接口，使得字符串可以被for...of循环遍历  
```javascript
    for (let codePoint of 'foo') {
        console.log(codePoint)
    }
    console.log([..."hrllo"]); //["h", "r", "l", "l", "o"]
```
### 模板字符串
模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。  
```javascript
let A,B
`The number is ${A + B}` === 'The number is ' + (A + B)  //true
```
### 新的API
- 传统上，JavaScript 只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6 又提供了三种新方法。  
    + includes()：返回布尔值，表示是否找到了参数字符串。
    + startWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
    + endWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
```javascript
let s = 'Hello world!'
s.startsWith('Hello') //true
s.endsWith('!') //true
s.includes('o') //true
```
- repeat方法返回一个新字符串，表示将原字符串重复n次
```javascript
        'x'.repeat(3) //"xxx"
```
- ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。
    + padStart()用于头部补全
    + padEnd()用于尾部补全。
```javascript
            '1'.padStart(10, '0') //"0000000001"
            '12'.padStart(10, '0') //"0000000012"
            '123456'.padStart(10, '0') //"0000123456"
            '1'.padEnd(10, '0') //"1000000000"
```
- ES2019 对字符串实例新增了trimStart()和trimEnd()这两个方法。它们的行为与trim()一致，它们返回的都是新字符串，不会修改原始字符串。
    + trimStart()消除字符串头部的空格。(trimLeft是trimStart的别名)
    + trimEnd()消除尾部的空格。(trimRight是trimEnd的别名)
```javascript
            const s = '  abc  ';
            s.trim() // "abc"
            s.trimStart() // "abc  "
            s.trimLeft() // "abc  "
            s.trimEnd() // "  abc"
            s.trimEnd() // "  abc"
            s.trimRight() // "  abc"
```