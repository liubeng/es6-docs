---
order: 11
title: promise
---

### 概述
所谓<code>Promise</code>，是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。语法上来看，<code>Promise</code>是一个对象，从它可以获取异步操作的消息。<code>Promise</code>有两个特点。
- 对象的状态不受外界影响。只有异步操作的结果可以决定当前是哪一种状态，它包含三个状态：
    - <code>pending</code>（进行中）
    - <code>resolved</code>（已成功）
    - <code>rejected</code>（已结束）
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。<code>Promise</code>对象的状态改变只有两种可能：从<code>pending</code>变成<code>resolved</code>和从<code>pending</code>变成<code>rejected</code>。只要这两种情况发生，状态就凝固了，不会再变了。  

<code>Promise</code>的缺点：

- 无法取消<code>Promise</code>，一旦新建它就会立即执行，无法中途取消。
- 如果不设置回调函数，<code>Promise</code>内部抛出的错误不会反应到外部。
- 当处于<code>pending</code>状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

```javascript
new Promise((resolve, reject) => {
    /* 异步操作 */
    if (true/* 异步操作成功 */){
        resolve(1);
    } else {
        reject(0);
    }
    console.log(2)
}).then(r => {
    console.log(r)
    x + 2
}).catch(function(error){
    console.log(error)
})
// 2
// 1
// ReferenceError: x is not defined
```
### Promise.then(resolved， rejected)
Promise 实例具有then方法，也就是说，<code>then()</code>方法是定义在原型对象<code>Promise.prototype</code>上的。它是为 Promise 实例添加状态改变时的回调函数。<code>then</code>方法返回的是一个新的<code>Promise</code>实例（注意不是原来那个<code>Promise</code>实例）。
```javascript
getJSON("posts.json").then(
    post =>  getJSON(post.commentURL)
).then(
    comments => console.log("resolved", comments),
    err => console.log("rejected", err)
)
```
上面代码中，第一个<code>then</code>方法指定的回调函数，返回的是另一个<code>Promise</code>对象。这时，第二个<code>then</code>方法的会根据这个新的<code>Promise</code>对象状态调用不同的回调函数。
### Promise.catch(error)
<code>Promise.catch()</code>方法是<code>.then(null, rejection)</code>或<code>.then(undefined, rejection)</code>的别名，用于指定发生错误时的回调函数。  
Promise 对象的错误具有冒泡性质，会一直向后传递，直至被捕获为止。

```javascript
someAsyncThing().then(function() {
    return someOtherAsyncThing()
  }).catch(function(error) {
      console.log('oh no', error)
      y + 2; someAsyncThing().then(function() {
          return someOtherAsyncThing()
        }).catch(function(error) {
        console.log('oh no', error)
        y + 2 // 会报错，因为y没有声明
    }).catch(function(error) {
        console.log('carry on', error)
    })
})
```
上面代码中，第二个<code>catch()</code>方法用来捕获前一个<code>catch()</code>方法抛出的错误。
### Promise.prototype.finally()
<code>finally()</code>方法用于指定不管Promise对象最后的状态如何，都会执行的操作。

```javascript
promise
.then(result => {...})
.catch(error => {...})
.finally(() => {...})
```
上面代码中，不管<code>promise</code>最后的状态，在执行完<code>then</code>或<code>catch</code>指定的回调函数以后，都会执行<code>finally</code>方法指定的回调函数。<code>finally</code>方法内的操作，应该是与状态无关，不依赖Promise的执行结果。它的实现如下：
```javascript
Promise.prototype.finally = function (callback) {
    let P = this.constructor
    return this.then(
        value => P.resolve(callback(()).then(() => value))
        reason => P.resolve(callback(()).then() => {throw reason})
    )
}
```
### Promise.all()
<code>Promise.all()</code>方法用于将多个Promise实例，包装成一个新的Promise实例。

```javascript
const p1 = new Promise((resolve, reject) => {
    resolve('hello')
    }).then(resilt => result).catch(e => e)
const p2 = new Promise((resolve, reject) => {
    throw new Error('p2报错了')
}).then(result => result).catch(e => e)
const p3 = new Promise((resolve, reject) => {
    throw new Error('p3报错了')
}).then(result => result)
const p = Promise.all([p1, p2]).then(
    res => console.log(res)
    ).catch(e => console.log(e))
const pp = Promise.all([p1, p2, p3]).then(
    res => console.log(res)
    ).catch(e => console.log(e))
    //result is not defined
    //Error: p2报错了
    //Error: p3报错了
```
上面代码中，<code>Promise.all()</code>方法接受一个数组作为参数，p1、p2、p3 都是Promise的实例。如若不是，就会先调用下面的<code>Promise.resolve()</code>方法，将参数转为 Promise 实例，再进一步处理。另外，<code>Promise.all()</code>方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。p 的状态由 p1、p2、p3 决定：
- 只有 p1、p2、p3 的状态都变成 fulfilled，p 的状态才会变成 fulfilled，此时 p1、p2、p3 的返回值组成一个数组，传递给 p 的回调函数。
- 只要 p1、p2、p3 之中有一个被<code>rejected</code>，p 的状态就会变成 <code>rejected</code>，此时第一个被<code>rejected</code>的实例的返回值，会传递给 p 的回调函数。
上面代码中，只有 p1、p2、p3 都变成<code>fulfilled</code>或者其中有一个变成<code>rejected</code>，才会调用<code>Promise.all</code>方法后面的回调函数。如若作为参数的 Promise 实例，自己定义了<code>catch</code>方法，那么它一旦被<code>rejected</code>，并不会触发<code>Promise.all()</code>的<code>catch</code>方法。   
上面代码中，p1 会被<code>resolved</code>，p2 首先会被<code>rejected</code>，但是p2 有自己的<code>catch</code>方法，该方法返回的是一个新的 Promise 实例，p2 指向的实际上是这个实例。该实例执行完<code>catch</code>方法后，也会被<code>resolved</code>，导致<code>Promise.all()</code> 方法参数里的两个实例都会<code>resolved</code>，因此会调用<code>then</code>方法指定的回调函数，而不会调用<code>catch</code>方法指定的回调函数。p3 没有自己的<code>catch</code>方法，就会调用<code>Promise.all()</code>的<code>catch</code>方法。
### Promise.race()
<code>Promise.race()</code>方法同样是将多个Promise实例，包装成一个新的Promise实例。

```javascript
const p = Promise.race([p1, p2, p3])
```
上面代码中，只要p1， p2， p3 之中有一个实例率先改变状态，p 的状态就跟着改变。那个率先改变的 Promise 实例的返回值就会传递给 p 的回调函数。
```javascript
const p = Promise.race([
    fetch('/getlist'), 
    new Promise(function (resolve, reject){
        setTimeout(() => reject(new Error('request timeout')), 5000)
    })
])
p.then(console.log).catch(console.error )
```
上面代码中，如果5秒之内<code>fetch</code>方法无法返回结果，变量 p 的状态就会变成<code>rejected</code>，从而触发<code>catch</code>方法指定的回调函数。

### Promise.allSettled()（ES2020引入）
<code>Promise.allSettled()</code>方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数都返回结果，不管是<code>resolved</code>还是<code>rejected</code>，包装实例才会结束。

```javascript
const resolved = Promise.resolve(666)
const rejected = Promise.reject(888)
Promise.allSettled([resolved, rejected]).then(res => {
    console.log(res)
})
// [
//    { status: 'fulfilled', value: 666 },
//    { status: 'rejected', reason: 888 }
// ]
```
上面代码中，<code>Promise.allSettled()</code>的返回值的状态只能变成<code>fulfilled</code>。监听函数接受的参数是对象数组 <code>res</code>，该数组的成员对应是<code>Promise.allSettled()</code>的 Promise 实例。每个对象都有<code>status</code>属性，该属性的值只能是字符串<code>fulfilled</code>或者<code>rejected</code>。<code>fulfilled</code>时，对象有<code>value</code>属性，<code>rejected</code>时有<code>reason</code>属性，对应两种状态的返回值。  
在我们不关心异步操作的结果，只关心这些操作有没有结束时，<code>Promise。allSettled()</code>方法就很有用，<code>Promise.all()</code>方法无法确保所有操作都结束。
### Promise.any()（ES2021引入）
<code>Promise.any()</code>方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只要参数实例有一个变成<code>fufilled</code>状态，包装实例就会变成<code>fufilled</code>状态，如果参数实例都变成<code>rejected</code>状态，包装实例就会变成<code>rejected</code>状态。   
<code>Promise.any()</code>跟<code>Promise.race()</code>方法很像，只有一点不同，不会因为某个 Promise 变成<code>rejected</code>状态而将自己变成<code>rejected</code>。

### Promise.resolve()
<code>Promise.resolve()</code>将现有对象转为 Promise 对象。<code>Promise.resolve()</code>等价于下面的写法。

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
<code>Promise.resolve()</code>方法的参数分成四种情况：

- 参数是一个 Promise 实例：<code>Promise.resolve()</code>将不做任何修改，直接返回这个实例。
- 参数是一个<code>thenable</code>对象：<code>thenable</code>对象是指具有<code>then</code>方法的对象。<code>Promise.resolve()</code>方法会将对象转为 Promise 对象，然后立即执行<code>thenable</code>对象的<code>then()</code>方法。
- 参数不是具有<code>then()</code>方法的对象，或根本不是对象：返回一个新的 Promise 对象，状态为<code>resolved</code>。
- 不带任何参数：直接返回一个<code>resolved</code>状态的 Promise 对象

### Promise.reject()
返回一个新的 Promise 实例，状态为 <code>rejected</code>

```javascript
const p = Promise.reject('出错了')
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
p.then(null, function(s) {
    console.log(s)
})
// 出错了
```

### 手写简易Promise
```javascript
const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'

function resolvePromise(promise2, x, resolve, reject) {
    // 不能引用同一个对象 可能会造成死循环
    if (promise2 === x) {
        return reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]---'))
    }
    let called // 防止多次调用，遵循promise a+规范
    // 判断是否为对象或函数，否则不可能是promise
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        // 有可能是 promise， 如果是就要有 then 方法
        try {
        // 取then的时候有风险，所有放在 try...catch 里取
            let then = x.then
            if (typeof then === 'function') {
                // 到了这里只能认为它是 promise了
                // 如果x是promise，那么在new的时候executor就立即执行了，就会执行他的resolve，数据就会传递到then中
                then.call(x, y => {
                    if (called) return
                    called = true
                    // 当前promise解析出俩的结果可能还是一个promise，直到解析到他是一个普通值
                    resolvePromise(promise2, y, resolve, reject) // resolve, reject 都是promise2的
                }， r => {
                    if(called) return
                    called = true
                    reject(r)
                })
            } else {
                // 出现像这种结果 {a:1, then:1}
                resolve(x)
            }
        } catch (e) {
            // 取 then 出错了，有可能在错误中又调用了该 promise 的成功或失败
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING // 宏变量，默认是pending
        this.value = undefined
        this.reason = undefined // then方法要访问的变量，放到this上
        this.onResolvedCallbacks = [] // 存放成功的回调函数
        this.onRejectedCallbacks = [] // 存放失败的回调函数
        let resolve = (value) => {
            if (value instanceof Promise) {
                value.then(resolve, reject)
                return
            }
            if (this.status === PENDING) {
                this.value = value
                this.status = RESOLVED
                // 让成功的方法依次执行
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                // 让失败的方法依次执行
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        // 执行executor传入成功和失败，把内部的resolve和reject传入executor中
        try {
            executor(resolve, reject)
        } catch (e) {
            console.log('catch错误', e)
            reject(e) // 如果内部出错，直接将error手动调用reject向下传递
        }
    }
    then(onfulfilled, onrejected) {
		onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v
		onrejected = typeof onrejected === 'function' ? onrejected : error => { throw error }
		let promise2 = new Promise((resolve, reject) => {
			if (this.status === RESOLVED) {
				setTimeout(() => {
					try {
						let x = onfulfilled(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) { 
						reject(e)
					}
				}, 0)
			}
			if (this.status === REJECTED) {
				setTimeout(() => {
					try {
						let x = onrejected(this.reason)
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) {
						reject(e);
					}
				}, 0)
			}
			if (this.status === PENDING) {
				this.onResolvedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onfulfilled(this.value)
							resolvePromise(promise2, x, resolve, reject)
						} catch (e) {
							reject(e)
						}
					}, 0)
				});
				this.onRejectedCallbacks.push(() => {
					setTimeout(() => {
						try {
							let x = onrejected(this.reason)
							resolvePromise(promise2, x, resolve, reject)
						} catch (e) {
							reject(e)
						}
					}, 0)
				});
			}
		});

		return promise2;
	}
	catch(errCallback) {
		return this.then(null, errCallback);
	}
}
module.exports = Promise

```









