import { useState, useEffect, Suspense, use } from 'react'
import { sleep } from '../utils/lang'

type Resource<T> = Promise<T>

export function App() {
  const [data, setData] = useState<Resource<number>>()
  useEffect(() => {
    const res = loadData()
    setData(res)
  }, [])

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>{data ? <Item data={data} /> : null}</Suspense>
    </div>
  )
}

type ItemProps = {
  data: Resource<number>
}

const Item = ({ data: res }: ItemProps) => {
  const data = use(res)
  return <div>{data}</div>
}

async function loadData() {
  await sleep(1000)
  return Math.random()
}
