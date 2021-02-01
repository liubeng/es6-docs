---
order: 4
---
## 函数

### 函数参数的默认值

    function log(x, y = 'World') {
        console.log(x, y);
    }
    log('Hello') // Hello World
    log('Hello', 'China') // Hello China
+ 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。这是因为length属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。
        (function (a) {}).length // 1
        (function (a = 5) {}).length // 0
        (function (a, b, c = 5) {}).length // 2
+ es6写法如果传入undefined，将触发该参数等于默认值，其他值不会触发默认值。
+ es6设置默认参数值，在函数体内不允许再次使用let或者const声明。例：

        function fn(a=10,b=20){
            let a=100;//Uncaught SyntaxError: Identifier 'a' has already been declared
            const b=20;//Uncaught SyntaxError: Identifier 'b' has already been declared
            console.log(a,b);
        }
+ 设置参数默认值会产生单独的作用域。  

        let x = 1;
        function f(y = x) {
            let x = 2;
            console.log(y);
        }
        f() // 1
+ 使用参数默认值时，函数不能有同名参数。  

        function fn(a,a,b){
            console.log(a,b);//不报错
        }
        function fn(a,a,b=1){
            console.log(a,b);//报错
        }
### rest参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中 

    function fn(...b){
        b.push('哈哈');
        console.log(b);
    }
    fn(1,'20');//[1, "20", "哈哈"]
#### 箭头函数

        var f = v => v;
        // 等同于
        var f = function (v) {
        return v;
        }
+ 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。因为箭头函数中没有 this ，所以也不能用 call()、apply()、bind() 等方法改变 this 的指向。（箭头函数的 this 指向离它最近的父级作用域 ）

        function foo() {
            setTimeout(() => {
                console.log('id:', this.id);
            }, 100);
        }
        var id = 21;
        foo();  // 21
        foo({ id: 42 });  // 21
        foo.call({ id: 42 }); // 42   

        // ES6
        function foo() {
            setTimeout(() => {
                console.log('id:', this.id);
            }, 100);
        }
        // ES5
        "use strict";
        function foo() {
            var _this = this;
            setTimeout(function () {
                console.log('id:', _this.id);
            }, 100);
        }
+ 不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。箭头函数的设计初衷是”即用即弃“，所以不能用它来定义新类型。所以，箭头函数中没有 prototype 属性，自然不能实例化，也就是不能用 new 关键字来调用。

        var des=(n)=>{this.n=n};
        new des(1);//des is not a constructor
        //因为没有this
+ 不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
+ 不可以使用yield命令，因此箭头函数不能用作 Generator 函数。