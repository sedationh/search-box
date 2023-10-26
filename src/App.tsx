import { useEffect, useMemo, useState } from "react"
import { BehaviorSubject, debounce, distinctUntilChanged, of, timer } from "rxjs"

// 产生 4000 2000 1000 4000 ...
const random2 = (function () {
  let i = 1

  const array = [4000, 2000, 1000]

  return () => {
    return array[i++ % array.length]
  }
})()

function request(value) {
  return new Promise<{
    data: string
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: value,
      })
    }, random2())
  })
}

function SearchBox() {
  const [result, setResult] = useState("")
  // 下面的 BehaviorSubject 和 Subject 一模一样，除了有一个初始值会在订阅时立刻发出
  const input$ = useMemo(() => new BehaviorSubject(""), [])
  // 输入内容时向流发送值
  const handleInput = (e) => {
    input$.next(e.target.value)
  }
  useEffect(() => {
    const subscription = input$
      .pipe(
        // 防抖的实现 -----------------------------
        debounce((input) => {
          if (input.length === 0) {
            return of(null) // 立即响应
          } else {
            return timer(500) // 等待 500ms
          }
        }),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        console.log("sedationh 1", v)
        setResult(v)
      })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <input onChange={handleInput} />
      {result}
    </>
  )
}

function App() {
  return (
    <>
      <SearchBox />
    </>
  )
}

export default App
