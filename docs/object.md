---
order: 6
title: 对象
---

### 属性的简介简洁表示
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
```javascript
let birth = '2000/01/01'
const Person = {
  name: '张三',
  birth,          //等同于birth: birth
  hello() {       // 等同于hello: function ()...
    console.log('我的名字是', this.name)
  }
}
```
### 属性名表达式
用表达式作为属性名，这时要将表达式放在方括号之内。
```javascript
let propKey = 'foo'
let obj = {
        [propKey]: true,
        ['a' + 'bc']: 123
}
// obj = {foo: true, abc: 123}
```
### 属性的遍历  
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor 方法可以获取该属性的描述对象。  
```javascript
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }
```
描述对象的 enumerable 属性，称为“可枚举性”，如果该属性为 false ，就表示某些操作会忽略当前属性。( for...in， Object.keys()， JSON.stringify()， Object.assign() )  

ES6 一共有 5 种方法可以遍历对象的属性:
1. for...in: 循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

2. Object.keys(obj): 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

3. Object.getOwnPropertyNames(obj): 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

4. Object.getOwnPropertySymbols(obj): 返回一个数组，包含对象自身的所有 Symbol 属性的键名。

5. Reflect.ownKeys(obj): 返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。  

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

+ 首先遍历所有数值键，按照数值升序排列。
+ 其次遍历所有字符串键，按照加入时间升序排列。
+ 最后遍历所有 Symbol 键，按照加入时间升序排列。
```javascript
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 }) // ['2', '10', 'b', 'a', Symbol()]
```
### super
super关键字指向当前对象的原型对象，用于访问和调用一个对象的父对象上的函数。
```javascript
super([arguments]);                  // 调用 父对象/父类 的构造函数
super.functionOnParent([arguments]); // 调用 父对象/父类 上的方法
```
### 扩展运算符（...）
- 解构赋值
对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。（浅拷贝）  
```javascript
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```
- 扩展运算符
对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。由于数组是特殊的对象，所以对象的扩展运算符也可以用于数组。
```javascript
let foo = { ...['a', 'b', 'c'] };
foo     // {0: "a", 1: "b", 2: "c"}
```
### 链判断运算符(.?)
读取对象内部的某个属性，往往需要判断一下该对象是否存在，这样的层层判断非常麻烦，因此 ES2020 引入了“链判断运算符”（optional chaining operator）?.，简化上面的写法。  
?.运算符，直接在链式调用的时候判断，左侧的对象是否为null或undefined。如果是的，就不再往下运算，而是返回undefined。
```javascript
const firstName = message.body.user.firstName;
const firstName = (message && message.body && message.body.user && message.body.user.firstName) || 'default';
const firstName = message?.body?.user?.firstName || 'default';
firstName?.run()                //判断对象方法 run 是否存在，如果存在就立即执行。
```
### Null判断运算符(??)
- ||  
        运算符左侧的值为空字符串，false，0，null 或 undefined 时，返回右侧的值。
- ??    
        行为类似 ||，运算符左侧的值为null或undefined时，才会返回右侧的值。
```javascript
const firstName = message?.body?.user?.firstName ?? 'default';
```
