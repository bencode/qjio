import { useState, useEffect, Suspense, use } from 'react'
import { sleep } from '../../utils/lang'

export function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Item />
      </Suspense>
    </div>
  )
}

type ItemProps = {}

const Item = ({}: ItemProps) => {
  const [dataRes, setDataRes] = useState<Promise<number>>()
  const data = dataRes ? use(dataRes) : null
  useEffect(() => {
    console.log('in item effect')
    if (dataRes) {
      return
    }
    const res = loadData()
    setDataRes(res)
  }, [])

  console.log('in item render')

  return <div>{data}</div>
}

async function loadData() {
  console.log('load data')
  await sleep(1000)
  return Math.random()
}

// 在非strict时，能正常工作
// 在strict时不能正常工作
// 组件要 resilient
// https://overreacted.io/writing-resilient-components/
