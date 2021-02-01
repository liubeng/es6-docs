---
order: 6
---

## 对象
### 属性的简介简洁表示
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。

        let birth = '2000/01/01'
        const Person = {
                name: '张三',
                birth,          //等同于birth: birth
                hello() {       // 等同于hello: function ()...
                        console.log('我的名字是', this.name)
                }
        }
### 属性名表达式
用表达式作为属性名，这时要将表达式放在方括号之内。

        let propKey = 'foo'
        let obj = {
                [propKey]: true,
                ['a' + 'bc']: 123
        }
        // obj = {foo: true, abc: 123}