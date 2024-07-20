import { create } from 'zustand'

const sleep = timeout => new Promise(r => setTimeout(r, timeout))

const useCounterStore = create(set => {
  const inc = async v => {
    await sleep(100)
    set(state => ({ count: state.count + v }))
  }

  const dec = v => inc(-v)

  return { count: 0, inc, dec }
})

export function App() {
  // NOTE: 不要使用这种模式
  const { count, inc, dec } = useCounterStore(state => state)
  return (
    <div>
      <h1>{count}</h1>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="button" onClick={() => inc(2)}>
          inc 2
        </button>
        <button type="button" onClick={() => dec(1)}>
          dec 1
        </button>
      </div>
    </div>
  )
}
