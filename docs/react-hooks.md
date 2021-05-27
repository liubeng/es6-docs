---
order: 14
title: React-Hooks
---

## Hook API
- 基础 Hook
    - useState
    - useEffect
    - useContext
- 额外的Hook
    - useReducer
    - useCallback
    - useMemo
    - useRef
    - useImperativeHandel
    - useLayoutEffect
    - useDebugValue    
## 基础 Hook
##### useState
base: 
```javascript
const [state, setState] = useState(initialState)
setState(newState) // newState会替换原来的state
setState(state => return {...state, ...newState} ) // 原来的state和newState合并
setState({count: this.state.count + 1}, () => {console.log(this.state.count)})
// 二个参数允许传入回调函数，在状态更新完毕后进行调用
```
tips:
- <code>useState</code>不会把新的state和旧的合并，而是直接替换
- 多次调用<code>useState</code>时，必须保证每次渲染时，<code>useState</code>的调用顺序不变
- Hook内部使用<code>Object.is</code>来比较新旧state是否相等，如果新的值没有变化则不重新渲染
##### useEffect
base: 
接受一个包含命令式，且可能有副作用代码的函数
```javascript
useEffect(() => {doSomeThing}, [changed1, changed2]) // 任意一项变化都会执行effect
useEffect(() => {doSomeThing}, []) // 仅会在组件挂载和卸载时执行
useEffect(() => {doSomeThing}, ) // 会在每次render之后执行effect

```
tips:
- 在浏览器完成布局与绘制之后，传给useEffect的函数会延迟调用（在新的渲染前执行），因此不应在函数中执行阻塞浏览器更新屏幕的操作。
- React会等待浏览器完成画面渲染之后才会延迟调用useEffect，将在组件更新前刷新上一轮渲染的effect
##### useLayoutEffect
base：与useEffect结构相同，区别只是调用时机不同，在所有的DOM变更之后**同步**调用effect。
tips:
- useLayoutEffect会在浏览器layout之后，painting之前执行
- 可以使用它来读取DOM布局并**同步**触发重渲染，在浏览器执行绘制之前，
- useLayoutEffect内部的更新计划将被**同步**刷新。
- 尽可能使用标准的useEffect以避免阻塞视觉更新
- 只有当useEffect出问题的时候再尝试使用 useLayoutEffect。
##### useContext
```javascript
const themes = {
    light: {
        foreground: '#000000',
        background: '#eeeeee'
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222'
    }
    const ThemeContext = React.createContext(themes.light)
    function App() {
        return (
            <ThemeContext.Provider value={themes.dark}>
                <Toolbar />
            </ThemeContext.Provider>
        )
    }
    function Toolbar(props) {
        return (
            <div>
                <ThemedButton />
            </div>
        )
    }
    function ThemedButton {
        const theme = useContext(ThemeContext)
        return (
            <button style={{background: theme.background, color: theme.foreground}}>
            I am style by theme context!
            </button>
        )
    }
}
```
base: 接收一个context对象并返回改context的当前值。当前的context值由上层组件中距离当前组件最近的<code><MyContext.Provider></code>的value prop决定。
tips：
- useContext的参数必须是context对象本身
- useContext(MyContext)只是让你能够读取context的值以及订阅context的变化
- 必须在上层组件树中使用<MyContext.Provider>为下层组件提供context
## 额外的 Hook
##### useReducer
```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init)
const [state, dispatch] = useReducer(reducer, {count: initialCount})//常用的简便写法
```
base:
useState的替代方案。接受一个形如(state, action)=>newState的reducer，并返回当前的state和配套的dispatch方法。
tips：
- 在state逻辑复杂且包含多个子值，或下一个state依赖于之前的情况下，useReducer比useState更适用
- 通过给子组件传递dispatch而不是回调函数，给会触发深更新的组件做性能优化。
```javascript
function init(initialCount) {
  return {count: initialCount};
}
function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return {count: state.count + 1}
        case 'decrement':
            return {count: state.count - 1}
        case 'reset'    
        default:
            throw new Error()    
    }
}
function Counter({initialCount}) {
    const [state, dispatch] = useReducer(reducer, initialCount, init)
    return (
        <>
            Count: {state.count}
            <button onClick={() => dispatch({type: 'reset', payload: initialCount})}>Reset</button>
            <button onClick={() => dispatch({type: 'decrement'})}>-</button>
            <button onClick={() => dispatch({type: 'increment'})}>+</button>
        </>
    )
}
```
#### useCallback
```javascript
const memoizedCallback = useCallback(() => {
    doSomething(a,b)
}, [a, b])
```
base:
返回一个memoized回调函数，该回调函数仅在某个依赖项改变时更新
tips：
- 依赖项数组不会作为参数传给回调函数
- useCallback(fn, deps)相当于useMemo(() => fn, deps)
#### useMemo
```javascript
const memoizedCallback = usememo(() => {
    computeExpensiveValue(a,b)
}, [a, b])
```
base:
返回一个memoized值，仅在某个依赖项改变才会重新计算值，避免每次渲染时都要进行高开销的计算。
tip:
- 传入useMemo的函数会在渲染期间执行
- 不要在传入的函数内部执行与渲染无关的操作，诸如副作用（effect）
- 如果没有提供依赖数组，每次渲染时都会计算新的值
- useMemo可以作为性能优化手段，但不要当成语义上的保证。
#### useRef