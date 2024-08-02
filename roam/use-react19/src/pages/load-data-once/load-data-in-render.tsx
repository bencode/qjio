import { Suspense, useMemo } from 'react'
import { range, sleep } from '../../utils/lang'

export function App() {
  return (
    <div>
      {range(4).map(i => (
        <Suspense key={i} fallback={<div>Loading...</div>}>
          <Item id={i + 1} />
        </Suspense>
      ))}
    </div>
  )
}

type ItemProps = {
  id: number
}

const Item = ({ id }: ItemProps) => {
  const data = useMemo(() => loadData(id), [id])
  return <div>{data}</div>
}

async function loadData(id: string) {
  const timeout = Math.floor(Math.random() * 500)
  await sleep(timeout)
  return `item: ${id}`
}
