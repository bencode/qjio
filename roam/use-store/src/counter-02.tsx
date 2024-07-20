import { create } from 'zustand'

const sleep = timeout => new Promise(r => setTimeout(r, timeout))

const useCounterStore = create(set => {
  const inc = async v => {
    await sleep(100)
    set(state => ({ count: state.count + v }))
  }

  const dec = v => inc(-v)

  const updateS2 = () => {
    set({ s2: Math.random() })
  }

  return { count: 0, inc, dec, s2: 0, updateS2 }
})

export function App() {
  return (
    <div>
      <CountApp />
      <div style={{ height: '100px' }} />
      <S2Item />
    </div>
  )
}

function CountApp() {
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

function S2Item() {
  const s2 = useCounterStore(v => v.s2)
  const update = useCounterStore(v => v.updateS2)

  return (
    <div>
      <h1>{s2}</h1>
      <button type="button" onClick={() => update()}>
        Update
      </button>
    </div>
  )
}
