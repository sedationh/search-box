import { useState } from "react"

// 产生 1000 - 5000 的随机数
function random() {
  const min = 1000
  const max = 5000
  const randomNumber = Math.floor(Math.random() * (max - min)) + min
  return randomNumber
}

console.log("sedationh random", random())

function request(value) {
  return new Promise<{
    data: string
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: value,
      })
    }, random())
  })
}

function SearchBox() {
  const [result, setResult] = useState("")
  const handleInput = (e) => {
    const value = e.target.value
    request(value).then((response) => {
      setResult(response.data)
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
