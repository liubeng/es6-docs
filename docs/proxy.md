---
order: 9
title: proxy
---

### 概述
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，属于"元编程"，即对编程语言进行编程。  
Proxy 在目标对象之前架设一层"拦截"，外界对该对象的访问，都必须先通过这层拦截，因此，可以对外界的访问进行过滤和改写。
```javascript
var obj = new Proxy({}, {
    get: function(target, propKey, receiver) {
        console.log(`getting ${propKey}!`)
        return Reflect.get(target, propKey, receiver)
    }
    set: function(target, propKey, receiver) {
        console.log(`setting ${propKey}!`)
        return Reflect.set(target, propKey, receiver)
    }
})
obj.count = 1 // setting count!
++obj.count
// getting count!
// setting count!
// 2
```
Proxy 重载了点运算，用自己的定义覆盖了语言的原始定义。ES6 原生提供 Proxy 构造函数
```javascript
var proxy = new Proxy(target, handler)
```
- target：使用 Proxy 包装的目标对象（可以是任何类型的JavaScript对象，包括原生数组，函数，甚至是另一个代理）。
- handler：一个通常以函数作为属性的对象，用来定制拦截行为。
Proxy实例可作为其他对象的原型对象  
在支持Proxy的浏览器环境，Proxy是一个全局对象，可以直接使用。Proxy（target， handler）是一个构造函数，target是被代理的对象，最终返回一个代理对象。
```javascript
var proxy = new Proxy({}, {
    get: function(target, propKey){
        return 35;
    }
})
let obj = Object.create(proxy)
obj.time // 35
```
上面代码中，<code>proxy</code> 对象是 <code>obj</code> 对象的原型，<code>obj</code> 对象本身并没有<code>time</code>属性，所以根据原型链，会在<code>proxy</code>对象上读取该属性，导致被拦截。  
Proxy支持的拦截操作有13种：
- get(target, propKey, receiver)：拦截对象属性的读取，比如<code>proxy.foo</code>和<code>proxy['foo']</code>
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如<code>proxy.foo = 1</code>
或<code>proxy['foo'] = 1</code>，返回一个布尔值。
- has(target, propKey)：拦截<code>propKey in proxy</code>的操作，返回一个布尔值。
- deleteProperty(target, propKey)：拦截<code>delete proxy[propKey]</code>的操作，返回一个布尔值。
- ownKeys(target)：拦截<code>Object.getOwnPropertyNames(proxy)</code>、<code>Object.getOwnPropertySymbols(proxy)</code>、<code>Object.keys(proxy)</code>、<code>for...in</code>循环，返回一个数组。该方法返回目标对象所有自身属性的属性名，而<code>Object.keys()</code>的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截<code>Object.getOwnPropertyDescriptor(proxy, propKey)</code>，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截<code>Object.defineProperty(proxy, propKey, propDesc)</code>、<code>Object.defineProperties(proxy, propDescs)</code>，返回一个布尔值。
- preventExtensions(target)：拦截<code>Object.preventExtensions(proxy)</code>，返回一个布尔值。
- isExtensible(target)：拦截<code>Object.isExtensible(proxy)</code>，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截<code>Object.setPrototypeOf(proxy)</code>，返回一个布尔值。
- apply(target, object, args)：拦截Proxy实例作为函数调用的操作，比如<code>proxy(...args)</code>、<code>proxy.call(object, ...args)</code>、<code>proxy.apply(...)</code>。
- construct(target, args)：拦截Proxy实例作为构造函数调用的操作，比如<code>new proxy(...args)</code>。

### Proxy 实例的方法（get(), set()）
最常用的方法就是<code>get()</code>和<code>set()</code>
##### get(target, propKey, receiver)
参数：目标对象，属性名和 Proxy 实例本身（操作行为所针对的对象）（可选）
```javascript
var person = { name: '张三' }
var proxy = new Proxy(person,{
    get: function(target, propKey) {
        if (propKey in target) {
            return target[propKey]
        } else {
            throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.")
        }
    }
})
proxy.name // "张三"
proxy.age // Uncaught ReferenceError: Prop name "age" does not exist.
let obj = Object.create(proxy);
obj.name // "张三"
```
正常情况下，没有这个拦截函数，访问不存在的属性，只会返回<code>undefined</code>。  
<code>get</code> 方法能被继承  
如果一个属性不可配置（configurable）且不可写（writable），则Proxy不能修改该属性，否则通过Proxy对象访问该属性会报错。  

```javascript
const target = Object.defineProperties({},{
    foo: {
        value: 123,
        writable: false
    }
})
const handler = {
    get(target, propKey) {
        return 'abc'
    }
}
const proxy = new Proxy(target, handler)
proxy.foo // TypeError: Invariant check failed
```
##### set(target, propKey, value, receiver)
参数：目标对象，属性名，属性值和 Proxy 实例本身（可选）
其中参数'receiver'可选  
```javascript
let validator = {
    set: function(obj, prop, value) {
        if(prop === 'age') {
            if(!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer')
            }
            if(value > 200){
                throw new RangeError('The age seems invalid')
            }
        }
        obj[prop] = value // 保存满足条件的 age 属性和其他属性
    }
}
let person = new Proxy({}, validator)
person.age = 100
person.age // 100
person.age = 'young' // TypeError: The age is not an integer
person.age = 300 // RangeError: The age seems invalid
```
上面代码中，存值函数<code>set</code>对于不符合要求的<code>age</code>属性赋值时，都会抛出错误。  
注意，如果目标对象自身的某个属性不可写，那么set方法将不起作用。严格模式下，<code>set</code>代理如果没有返回<code>true</code>，就会报错。

### Proxy.revocable()
<code>Proxy.revocable()</code>方法返回一个可取消的Proxy实例

```javascript
let target = {}
let handler = {}
let {proxy, revoke} = Proxy.revocable(target, handler)
proxy.foo = 123
proxy.foo // 123
revoke()
proxy.foo // TypeError: Revoked
```
<code>Proxy.revocable()</code>方法返回一个对象，该对象的<code>proxy</code>属性是<code>Proxy</code>实例，rovoke属性是一个函数，可以取消<code>Proxy</code>实例。所以指向<code>revoke</code>函数后，再访问<code>Proxy</code>实例就会抛出一个错误。

### this指向
Proxy 会改变<code>target</code>中的<code>this</code>指向，一旦 Proxy 代理了 <code>target</code>，<code>target</code>内部的<code>this</code>则指向了 Proxy 代理。需要手动绑定原始对象。
```javascript
const target = new Date('2021-02-25')
const handler = {}
const proxy = new Proxy(target, handler)
console.log(proxy.getDate()) // TypeError: this is not a Date object

const handler2 = {
    get(target, prop) {
        if (prop === 'getDate') {
            return target.getDate.bind(target)
        }
        return Reflect.get(target, prop)
    }
}
const proxy2 = new Proxy(target, handler2)
console.log(proxy2.getDate()) // 25
```

### Object.defineProperty(target, propKey, propDesc) 和 Proxy 的区别
参数：目标对象，属性名，属性描述符。  
- <code>Object.defineProperty</code>方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。在 get 中进行依赖收集，set 数据时通知订阅者更新。
    - 只能劫持对象的属性，不能直接代理对象。
    - 无法检测到对象属性的新增或删除。
    - 不能监听数组的变化，无法触发数组的操作方法。
    - 只能对属性进行劫持，必须遍历对象的每一个属性，如果属性值也是对象。则需要深度遍历嵌套的对象。
    - 只有get和set拦截。
    - 兼容性好。
    
- <code>Proxy</code>
    - 直接监听对象而非属性，只需做一层代理就可以监听同级结构下的所以属性变化。
    - 能检测到对象的新增属性和删除属性。
    - 并返回一个新对象，不需要遍历操作。
    - 可以直接监听数组的变化。
    - 有13种拦截方式。
    - 兼容性相对较差。

