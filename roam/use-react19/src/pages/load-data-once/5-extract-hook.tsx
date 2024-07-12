import { useState, useEffect, Suspense, use } from 'react'
import { sleep } from '../../utils/lang'

const range = (n: number) => [...Array(n).keys()]

export function App() {
  return (
    <div>
      {range(4).map(i => (
        <Suspense fallback={<div>Loading...</div>}>
          <Item id={`id${i + 1}`} />
        </Suspense>
      ))}
    </div>
  )
}

type ItemProps = {
  id: string
}

const Item = ({ id }: ItemProps) => {
  const data = useDataEffect(() => loadData(id))
  return <div>{data}</div>
}

type Loader<T> = () => Promise<T>

function useDataEffect<T>(loader: Loader<T>) {
  const [data, setData] = useState<Promise<T>>()
  useEffect(() => {
    if (!data) {
      setData(loader())
    }
  }, [])
  return data ? use(data) : undefined
}

async function loadData(id: string) {
  const timeout = Math.floor(Math.random() * 3000)
  await sleep(timeout)
  return `item: ${id}`
}
