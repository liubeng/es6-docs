
## Running Time

 在词法环境内部，维护了一个小型栈结构，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压到栈顶；当作用域执行完成之后，该作用域的信息就会从栈顶弹出进入块级作用域不会有编译过程，只不过通过let或者const声明的变量会在进入块级作用域的时被创建，但是在该变量没有赋值之前，引用该变量JavaScript引擎会抛出错误---这就是“暂时性死区”。

![Image text](https://user-gold-cdn.xitu.io/2019/3/17/1698ac2c8ca10784?imageslim)

        function foo(b) {
            var a = 5;
            return a * b + 10;
        }
        function bar(x) {
            var y = 3;
            return foo(x*y);
        }
        console.log(bar(6));

![Image text](https://image.fundebug.com/2019-0410-03.png)        
### 回调队列
回调队列会按照添加的顺序存储所有的回调函数，然后等待执行栈为空。当执行栈为空的时候，回调队列会把队列首部的那个回调函数推入执行栈。当执行栈再次为空的时候，再将此时队列首部函数推入。

Note： *队列是一个FIFO的数据结构-先进先出。相比于栈的在尾部添加、移除数据，队列是在尾部添加数据，在首部移除数据。*

### 事件循环
事件循环可以被看作是JS运行时环境中的这样的一个东西：它的工作是持续的检测调用栈和回调队列，如果检测到调用栈为空，它就会通知回调队列把队列中的第一个回调函数推入执行栈。调用栈和执行队列可能在某一段时间内是闲置的，但是事件循环是永不停歇的检测前两者的。在任意时间，只要Web API容器中的事件达到触发条件，就可以把回调函数添加到回调队列中去。

        console.log('Hi');
        setTimeout(function cb1() { 
            console.log('cb1');
        }, 5000);
        console.log('Bye');
![Image text](https://pic1.zhimg.com/v2-3baaa2030f404cf2375836958a3b2584_b.webp)