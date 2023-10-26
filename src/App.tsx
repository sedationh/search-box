import { useEffect, useMemo, useRef, useState } from "react"
import { BehaviorSubject, Observable, debounce, distinctUntilChanged, of, switchMap, timer } from "rxjs"

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

function fetcher(input: string): Promise<{
  value: string
  error: boolean
}> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) reject()
      resolve("api " + input)
    }, Math.random() * 1000)
  })
    .then((res) => {
      return {
        value: res,
        error: false,
      }
    })
    .catch(() => {
      return {
        value: "",
        error: true,
      }
    })
}

function SearchBox() {
  const [result, setResult] = useState("")
  // 下面的 BehaviorSubject 和 Subject 一模一样，除了有一个初始值会在订阅时立刻发出
  const input$ = useMemo(() => new BehaviorSubject(""), [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const errorRef = useRef<boolean>(false)
  errorRef.current = error

  // 输入内容时向流发送值
  const handleInput = (e) => {
    input$.next(e.target.value)
  }
  useEffect(() => {
    const subscription = input$
      .pipe(
        // 防抖的实现 -----------------------------
        debounce((input) => {
          // 补充 error 处理
          if (input.length === 0 || errorRef.current) {
            return of(null) // 立即响应
          } else {
            return timer(500) // 等待 500ms
          }
        }),
        distinctUntilChanged(),
        // 网络请求的实现 -----------------------------
        switchMap((input) => {
          if (input.length === 0) {
            setLoading(false)
            setError(false)
            return of({
              value: "default",
              error: false,
            })
          }
          setError(false)
          setLoading(true)
          return fetcher(input)
        })
      )
      .subscribe({
        next: ({ error, value }) => {
          if (error) {
            setError(true)
            setLoading(false)
          } else {
            setError(false)
            setLoading(false)
            setResult(value)
          }
        },
      })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <div>
        <input onChange={handleInput} />
      </div>
      {error ? "error" : loading ? "loading" : result}
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
