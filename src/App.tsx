import { useRef, useState } from "react"

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
  const latestRequestTimeRef = useRef(0)
  const handleInput = (e) => {
    const value = e.target.value
    const requestTime = Date.now() // 记录时间
    latestRequestTimeRef.current = requestTime
    request(value).then((response) => {
      if (requestTime >= latestRequestTimeRef.current) {
        // 对比时间
        setResult(response.data)
      }
    })
  }
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
