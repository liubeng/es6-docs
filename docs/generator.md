---
order: 12
title: Iterator
---

### Iterator（遍历器）的概念
遍历器是一种接口，为不同的数据结构提供统一的访问机制。任何数据结构只有部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。ES6 规定，默认的 Iterator 接口部署在数据结构的<code>Symbol.iterator</code>上。它的作用有三个：
- 为各种数据结构提供一个统一的、简便的访问接口。
- 使得数据结构的成员能够按某种次序排列。
- ES6 创造了一种新的遍历命令<code>for...of</code>循环，Iterator 接口主要供<code>for...of</code>消费

Iterator的遍历过程是这样的：
1. 创建一个指针对象，指向当前数据结构的起始位置。（遍历器对象本质上，就是一个指针对象）
2. 第一次调用指针对象的<code>next</code>，可以将指针指向数据结构的第一个成员。
2. 第二次调用指针对象的<code>next</code>，指针就指向数据结构的第二个成员。
4. 不断调用只指针对象的<code>next</code>，直至它指向数据结构的结束位置。

每一次调用<code>next</code>方法，都会返回数据结构的当前成员信息，一个包含（<code>value</code>（当前属性的值）和<code>done</code>（当前遍历是否结束的布尔值））两个属性的对象。
```javascript
const obj = {
    [Symbol.iterator]: function () {
        return {
            next: function() {
                return {
                    value: 1,
                    done: true
                }
            }
        }
    }
}
let arr = ['a', 'b', 'c']
let iter = arr[Symbol.iterator]
iter.next()// {value: 'a', done: false}
iter.next()// {value: 'b', done: false}
iter.next()// {value: 'c', done: false}
iter.next()// {value: undefined, done: true}
```
原生具备 Iterator 接口的数据结构有：<code>Array</code>、<code>Map</code>、<code>Set</code>、<code>String</code>、<code>TypedArray</code>（类型化数组如 Int8Array, Int16Array 等）、函数的<code>arguments</code>、<code>NodeList</code>、