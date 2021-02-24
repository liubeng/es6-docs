---
order: 8
title: Set and Map
---
## Set
类似数组，但成员都是唯一的，没有重复值。
```javascript
const s = new Set()
[2,3,5,4,5,2,2].forEach(x=> s.add(x))
for(let i of s){
  console.log(s)
}
// 2 3 5 4
```
Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
```javascript
// 去除数组的重复成员
[...new Set([2,5,4,5,2)]
// "2,5,4"
//去除字符串里面的重复字符
[...new Set('ababbc')].join('')
// "abc"
```
在 Set 内部，两个NaN是相等的，两个对象总是不相等的。
```javascript
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
set.add({});
set.size // 2

set.add({});
set.size // 3
```
### Set 实例的属性和方法
属性：
- constructor：构造函数，默认就是Set函数。
- size：返回Set实例的成员总数。
基础方法：
- add(value)：添加某个值，返回 Set 结构本身。
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。
遍历操作
- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员
由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。
```javascript
let s = new Set()
s.add(1).add(2).add(2);
// 注意2被加入了两次
s.size // 2
s.has(1) // true
s.has(2) // true
s.has(3) // false
s.keys() // SetIterator {1, 2}
s.values() // SetIterator {1, 2}
s.delete(2);
s.has(2) // false
```
Array.from方法可以将 Set 结构转为数组。这就提供了去除数组重复成员的另一种方法。
```javascript
function dedupe(array) {
  return Array.from(new Set(array))
}
dedupe([1, 1, 2, 3]) // [1, 2, 3]
[...new Set([1, 1, 2, 3])] // [1, 2, 3]
```
因此使用 Set 可以很容易地实现并集（Union）、交集（Intersect）和差集（Difference）
```javascript
let a = new Set([1,2,3])
let b = new Set([4,3,2])
// 并集
let union = new Set(...a, ...b)
// 交集
let intersect = new Set([...a].filter(x=> b.has(x))) // Set {2, 3}
// （a相对于b的）差集
let difference = new Set([...a].filter(x=> !b.has(x))) // Set{1}

```

## WeakSet
WeakSet结构与Set类似，也是不重复的值的集合，但与Set有两个区别：
- WeakSet的成员只能是对象，而不能是其他类型的值
- WeakSet中的对象都是弱引用，垃圾回收机制不考虑WeakSet对该对象的引用，若其他对象不再引用改对象，垃圾回收机制就会自动回收该对象所占用的内存，不会考虑该对象还存在于WeakSet之中。WeakSet的成员不适合引用，因为它会随时消失。WeakSet的成员个数取决于垃圾回收机制有没有运行，运行前后的成员个数是不一样的，因此，ES6规定WeakSet不可遍历。WeakMap也有这些特点。
```javascript
const a = [[1, 2], [3, 4]]
const ws = new WeakSet(a)// WeakSet {[1, 2], [3, 4]}
const b = [3, 4]
const ws2 = new WeakSet(b)// Uncaught TypeError: Invalid value used in weak set(…)
```
将a作为WeakSet构造函数的参数，a的成员会自动成为WeakSet的成员，而不是a数组本身，因此该数组的成员必须是对象，数组b的成员不是对象，加入WeakSet就会报错。  
WeakSet结构有以下三个方法：
- WeakSet.prototype.add(obj)：向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(obj):：清除WeakSet实例的指定成员。
- WeakSet.prototype.has(obj)：返回一个布尔值，表示某个值是否在WeakSet实例中。

## Map
类似对象，是键值对的集合，但"键"的范围不限于字符串，各种类型(包括对象)都可以当做键。Object 结构提供了"字符串——值"的对应，Map 结构提供了"值——值"的对应，是一种更完善的Hash结构实现。
```javascript
const m = new Map()
const o = {p: 'Hello world!'}
m.set(o, 'content')
m.get(o) // 'content'
m.has(o) // true
m.delete(o) // true
m.has(o) // false

const map = new Map([['name', '张三'], ['title', 'Author']])
map.size // 2
map.has('name') // true
map.get('name') // '张三'
map.has('title') // true
map.get('title') // 'Author'
map.set('name', '李四')
map.get('name') // '李四'
```
不仅是数组。任何具有Iterator接口，且每个成员都是一个双元素的数组的数据结构都可以当作 <code>Map</code> 构造函数的参数。 <code>Set</code> 和 <code>Map</code>都可以用来生成新的 Map。
```javascript
const set = new Set([['foo', 1], ['bar', 2]])
const m1 = new Map(set)
m1.get('foo') // 1
const m2 = new Map([['baz', 3]])
const m3 = new Map(m2)
m3.get('baz') // 3
```
注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。
```javascript
const map = new Map([)
map.set(['a', 555])
map.get(['a']) // undefined

const k1 = ['a']
const k2 = ['a']
map.set(k1, 111).set(k2, 222)
map.get(k1) // 111
map.get(k2) // 222
```
由上可知，Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。  
如果 Map 的键是一个简单类型的值（数字，字符串，布尔值），则只要两个值严格相等，Map 将其视为一个键
- <code>0</code> 和 <code>-0</code>是同一个键。
- 布尔值<code>true</code>和字符串<code>'true'</code>则是两个不同的键。
- <code>undefined</code>和<code>null</code>也是两个不同的键。
- 虽然<code>NaN</code>不严格相等于自身，但 Map 将其视为同一个键
```javascript
let map = new Map()

map.set(-0, 123)
map.get(+0) // 123

map.set(true, 1)
map.set('true', 2)
map.get(true) // 1

map.set(undefined, 3)
map.set(null,4)
map.get(undefined) // 3

map.set(NaN, 123)
map.get(NaN) // 123
```
### Map实例的属性和方法
- <code>size</code> 属性：返回 Map 结构的成员总数
- <code>set(key, value)</code>: 设置键名 <code>key</code> 对应的键值 <code>value</code>，然后返回整个 Map 结构，如果 <code>key</code> 已经有值，则键值会被更新，否则生成该键。
- <code>get(key)</code>：<code>get</code> 方法读取 <code>key</code> 对应的键值，如果找不到 <code>key</code>，返回 <code>undefined</code> 
- <code>has(key)</code>：<code>has</code> 方法返回一个布尔值，表示某个键是否在当前Map对象之中。 
- <code>delete(key)</code>：<code>delete</code> 方法删除某个键，返回 <code>true</code>。如果删除失败，返回 <code>false</code>
- <code>clear()</code>：<code>clear</code> 方法清除所以成员，没有返回值。
遍历方法：
- <code>keys()</code>: 返回键名的遍历器。
- <code>values()</code>: 返回键值的遍历器。
- <code>entries()</code>: 返回所以成员的遍历器。
- <code>forEach()</code>: 遍历Map的所有成员。
Map的遍历顺序就是插入顺序。
```javascript
const map = new Map([['F', 'no'], ['T',  'yes']]);

for(let key of map.keys()) {
  console.log(key)
}
// 'F'
// 'T'
for(let value of map.values()) {
  console.log(value)
}
// 'no'
// 'yes'
for(let [key, value] of map.entries()){
  console.log(key, value)
}
// 'F' 'no'
// 'T' 'yes'
for(let [key, value] of map){
  console.log(key, value)
}
// 'F' 'no'
// 'T' 'yes'
map[Symbol.iterator] === map.entries // true
```
### 与其他数据结构的互相转换
- 数组转为 Map：将数组传入Map构造函数就可以转为 Map
- Map 转数组：扩展运算符（...）
- Map 转为对象：如果所有 Map 的键都是字符串，他可以无损转为对象。如果有非字符串的键名，那么会把键名转换成字符串，再作为对象的键名。
```javascript
const myMap = new Map([[true, 7], [{foo: 3}, ['abc']]])
[...myMap] // [[true, 7], [{foo: 3}, ['abc']]]
function strMapToObj(strMap){
  let obj = Object.create(null)
  for(let [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
strMapToObj(myMap) // {[object Object]: ['abc'], true: 7}
```
- 对象转为 Map：对象转为Map可以通过Object.entries()
```javascript
let obj = { 'a': 1, 'b': 2}
let map = new Map(Object.entries(obj))
```
- Map 转为 JSON：
  - Map 键名都是字符串，可以选择转为对象JSON
  - Map 键名有非字符串，可以选择转为数组JSON
```javascript
function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap))
}
let myMap = new Map().set('yes', true).set('no', false)
setMapToJson(myMap) // '{"yes": true, "no": false}'

function mapToArrayJson(map) {
  return JSON.stringify([...map])
}
let myMap2 = new Map().set(true, 7).set({foo:3}, ['abc'])
mapToArrayJson(myMap) // '[[true, 7], [{"foo": 3},["abc"]]]'
```
- JSON 转为 Map：JSON 转为 Map，正常情况，所有键名都是字符串。
```javascript
function jsonToStrMap(jsonStr) {
  return objToString(JSON.parse(jsonStr))
}
jsonToMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}
```
## WeakMap
<code>WeakMap</code> 结构与 <code>Map</code> 结构类似，也是用于生成键值对的集合。有两点区别：  
- <code>WeakMap</code>只接受对象作为键名（<code>null</code>除外），不接受其他类型的值作为键名。
- <code>WeakMap</code>的键名所指向的对象，不计入垃圾回收机制。类似于<code>WeakSet</code>。

基本上，如果你想往对象上添加数据又不想干扰垃圾回收机制，就可以使用<code>WeakMap</code>。
注意，<code>WeakMap</code>弱引用的只是键名，而不是键值。键值依然是正常引用。
WeakMap 与 Map 在API上的区别主要是两个：
- <code>WeakMap</code>没有遍历操作（<code>keys()</code>、<code>values()</code>、<code>entries()</code>方法），也没有 <code>size</code> 属性。
- <code>WeakMap</code>无法清空，即没有 <code>clear()</code> 方法。只有四个方法可用：<code>get()</code>、<code>set()</code>、<code>has()</code>、<code>delete()</code>。