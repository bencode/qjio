import { useState, useEffect } from 'react'

const sleep = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))

export function App() {
  const [data, setData] = useState<number>()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const res = await loadData()
        setData(res)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <div>
      {loading ? <div>Loading...</div> : null}
      {data ? <div>{data}</div> : null}
    </div>
  )
}

async function loadData() {
  await sleep(1000)
  return Math.random()
}
