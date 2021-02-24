---
order: 7
title: Symbol
---
### 定义
新的原始数据类型Symbol，表示独一无二的值，Symbol 值通过Symbol函数生成。
```javascript
let s1 = Symbol('foo'); // Symbol(foo)
let s2 = Symbol('foo'); // Symbol(foo)
let s3 = Symbol();      // Symbol() 
s1===s2 // false
s1.toString() // "Symbol(foo)" => Symbol 值可以显式转为字符串。
typeof s2 // "symbol" => symbol是一种数据类型
Boolean(s3) // true => Symbol 值可以显式转为布尔值
!s2 // false => Symbol 值可以显式转为布尔值
sym + 2 // TypeError => Symbol 值不能转为数值
```
### 描述（Symbol.prototype.description）
```javascript
const sym = Symbol('foo');
sym.description // "foo"
```
sym的描述就是字符串foo，实例属性 description，直接返回 Symbol 的描述。

### 作为属性名的 Symbol
```javascript
let mySymbol = Symbol()
let a = {}
a[mySymbol] = 'Hello!'
let b = {
    [mySymbol]: 'Hello!'
}
let c = {}
Object.defineProperty(c, mySymbol, { value: 'Hello!' })
a[mySymbol] === b[mySymbol] // true
a[mySymbol] === c[mySymbol] // true

let d = {}
d.mySymbol = 'Hello!'
d[mySymbol] // undefined
```
### 消除魔术字符串
将代码中多次出现，与代码强耦合的某一具体字符串或数值（其值并不重要，只要不与其他属性和值冲突即可）用 symbol 代替
### 属性名的遍历
在遍历对象时， Symbol 作为属性名，不会出现在 <code>for...in</code>、<code>for...of</code> 循环中，也不会被 <code>Object.keys()</code>、<code>Object.getOwnPropertyNames()</code>、<code>JSON.stringify()</code>返回。
但是，它也不是私有属性，有一个<code>Object.getOwnPropertySymbols()</code>方法，可以获取指定对象的所有 Symbol 属性名。
```javascript
const obj = {};
const foo = Symbol('foo');
obj[foo] = 'bar';
for (let i in obj) {
  console.log(i); // 无输出
}
Object.getOwnPropertyNames(obj) // []
Object.getOwnPropertySymbols(obj) // [Symbol(foo)]
```
### Symbol.for()，Symbol.keyFor()
Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。  
Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key。
```javascript
Symbol.for("bar") === Symbol.for("bar") // true
Symbol("bar") === Symbol("bar") // false

let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"
let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```