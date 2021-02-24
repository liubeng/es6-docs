---
order: 5
title: 数组
---

### 拓展运算符（...）
扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。  
```javascript
// rest
function fn(...b){
  b.push('哈哈')
  console.log(b)
}
// es6
fn(1,'20', ...[1,2,3])                        //[1, "20", 1, 2, 3, "哈哈"]
// es5
fn.apply(void 0, [1, '20'].concat([1, 2, 3])) //[1, "20", 1, 2, 3, "哈哈"]
```
+ 复制数组
```javascript
        const a1 = [1, 2];
        // 写法一
        const a2 = [...a1];
        // 写法二
        const [...a2] = a1;
```
+ 合并数组
```javascript
        const arr1 = ['a', 'b']
        const arr2 = ['c']
        const arr3 = ['d', 'e']
        // ES5 的合并数组
        arr1.concat(arr2, arr3)
        // ES6 的合并数组
        [...arr1, ...arr2, ...arr3]
```
+ 字符串，将字符串转换为数组
```javascript
        [...'hello'] // [h,e,l,l,0]
```
### Array.from() 
Array.from 方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）
```javascript
let arrayLike = {
        '0': 'a',
        '1': 'b',
        '2': 'c',
        length: 3
};
// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6的写法
let arr2 = Array.from(arrayLike);    // ['a', 'b', 'c']
```
### Array.of()
Array.of 方法用于将一组值，转换为数组。Array.of总是返回参数值组成的数组。如果没有参数，就返回一个空数组。  
```javascript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```
### find() 和 findIndex()
用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 true 的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。
```javascript
[1, 4, -5, 10].find((n) => n < 0)
```
###  entries()，keys() 和 values() 
用于遍历数组,它们都返回一个遍历器对象,可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
```javascript
for (let index of ['a', 'b'].keys()) {
        console.log(index);
}
// 0
// 1
for (let elem of ['a', 'b'].values()) {
        console.log(elem);
}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {
        console.log(index, elem);
}
// 0 "a"
// 1 "b"
```
### includes()
Array.prototype.includes 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 includes 方法类似。ES2016 引入了该方法。
```javascript
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```
### flat()，flatMap() 
数组的成员有时还是数组
+ Array.prototype.flat()用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
+ flatMap()方法对原数组的每个成员执行一个函数（相当于执行 Array.prototype.map()），然后对返回值组成的数组执行 flat() 方法。该方法返回一个新数组，不改变原数组。
```javascript
[1, 2, [3, [4, 5]]].flat()           // [1, 2, 3, [4, 5]]
[1, 2, [3, [4, 5]]].flat(2)          // [1, 2, 3, 4, 5]
[1, [2, [3]]].flat(Infinity)         // [1, 2, 3] Infinity表示任意层
[2, 3, 4].flatMap((x) => [x, x * 2]) // [2, 4, 3, 6, 4, 8]
```
