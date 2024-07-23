import { useSyncExternalStore } from 'react'

type Handler = () => void
type Transformer<T> = (state: T) => T

function create<T>(init: T) {
  let state = init

  const listeners: Handler[] = []

  const subscribe = (fn: Handler) => {
    listeners.push(fn)
    return () => {
      const index = listeners.findIndex(fn)
      if (index >= 0) {
        listeners.slice(index, 1)
      }
    }
  }

  const get = () => {
    return state
  }

  const set = (tr: Transformer<T>) => {
    const next = tr(state)
    state = next
    listeners.forEach(fn => fn())
  }

  return { subscribe, get, set }
}

const store = create({ count: 1 })

export function App() {
  const handleClick = () => {
    store.set(prev => {
      return { count: prev.count + 1 }
    })
  }
  return (
    <div>
      <Counter />
      <button onClick={handleClick}>inc</button>
    </div>
  )
}

function Counter() {
  const { count } = useSyncExternalStore(store.subscribe, store.get)
  return <h1>{count}</h1>
}
