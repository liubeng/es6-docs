---
order: 10
title: reflect
---

### 概述
<code>Reflect</code>对象和<code>Proxy</code>对象一样，也是ES6为了操作对象而提供的新API。<code>Reflect</code>对象设计的目的：  

- 将<code>Object</code>对象的一些明显属于语言内部的方法（如<code>Object.defineProperty</code>），放到<code>Reflect</code>对象上。从<code>Reflect</code>对象可以拿到语言内部的方法。
- 修改某些<code>Object</code>方法的返回结果，让其更合理。如<code>Object.defineProperty(obj, name, desc)</code>在无法定义属性时，会抛出一个错误，而<code>Reflect.defineProperty(obj, name, desc)</code>则会返回<code>false</code>。
- 让<code>Object</code>操作都变成函数行为。将<code>Object</code>某些命令式操作，如将<code>name in obj</code>和<code>delete obj[name]</code>变成<code>Reflect.has(obj, name)</code>和<code>Reflect.deleteProperty(obj, name)</code>这样的函数行为。
- <code>Reflect</code>对象的方法与<code>Proxy</code>对象的方法一一对应。不管<code>Proxy</code>怎么修改默认行为，你总可以在<code>Reflect</code>上获取默认行为。
```javascript
Proxy(target, {
    set: function(target, name, value, receiver) {
        var success = Reflect.set(target, name, value, receiver)
        if(success) {
            console.log('property ' + name + ' on ' + target + ' set to ' + value)
        }
        return success
    }
})
```
上面代码中，<code>Proxy</code>方法拦截<code>target</code>对象的属性赋值行为。它采用<code>Reflect.set</code>方法将值赋值给对象的属性，确保完成原有的行为，然后再部署额外的功能。

### 静态方法
<code>Reflect</code>对象一共有13个静态方法，大部分与<code>Object</code>对象的同名方法的作用是相同的，而且它与<code>Proxy</code>对象的方法是一一对应的。

- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target): 判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）
- Reflect.preventExtensions(target): 让一个对象变的不可扩展，也就是永远不能再添加新的属性。
- Reflect.getOwnPropertyDescriptor(target, name): 返回指定对象上一个自有属性（不需要从原型链上进行查找的属性）对应的属性描述符。
- Reflect.getPrototypeOf(target)：返回制定对象的原型。（内部[[prototype]]属性的值）
- Reflect.setPrototypeOf(target, prototype)：设置一个指定的对象的原型（内部[[Prototype]]属性）到另一个对象或 null。

#### Reflect.get(target, name, receiver)
<code>Reflect.get</code>查找并返回<code>target</code>对象的<code>name</code>属性，如果没有则返回<code>undefined</code>。 

```javascript
var myObject = {
    foo: 1,
    bar: 2,
    get baz() {
        return this.foo + this.bar
    }
}
var myReceiverObj = {
    foo: 3,
    bar: 4
}
Reflect.get(myObject, 'baz', myReceiverObj) // 7
Reflect.get(myObject, 'fooo') // undefined
Reflect.get(1, 'foo') // Reflect.get called on non-object
```
#### Reflect.set(target, name, value, receiver)
<code>Reflect.set</code>方法设置<code>target</code>对象的<code>name</code>属性等于<code>value</code>。如果<code>Proxy</code>对象和<code>Reflect</code>对象联合使用，前者拦截赋值操作，后者完成赋值操作的默认行为，而且传入了<code>receiver</code>，那么<code>Reflect.set</code>会触发<code>Proxy.defineProperty</code>拦截。

```javascript
let p = { a: 'a' }
let handler = {
    set(target, key, value, receiver) {
        console.log('set')
        Reflect.set(target, key, value, receiver)
        // Reflect.set(target, key, value) 不传入receiver就不会触发defineProperty拦截
        Reflect.set(1, 'foo', {}) // 第一个参数不是对象会报错
    }
    defineProperty(target, key, attribute) {
        console.log('defineProperty')
        Reflect.defineProperty(target, key, attribute)
    }
}
let obj = new Proxy(p, handler)
obj.a = 'A'
// set
// defineProperty
```

### 实例：使用Proxy实现观察者模式
观察者模式是函数自动观察数据对象，一旦对象有变化，函数就会自动执行，该机制包括：
- 一个用于存储订阅者对象引用的列表成员变量
- 几个用于添加或删除该列表中订阅者的公有方法


```javascript
const queuedObservers = new Set()
const observe = fn => queuedObservers.add(fn)
const observable = obj => new Proxy(obj, {set})
function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    queuedObservers.forEach(observer => observer())
    return result
}
```
上面代码中，先定义了一个<code>Set</code>集合，所有观察者函数都放进这个集合。然后，<code>observable</code>函数返回原始对象的代理，拦截赋值操作。拦截函数<code>set</code>之中，会自动执行所有观察者。
