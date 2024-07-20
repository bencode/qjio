import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useStore = create(set => {
  const updateA = () => {
    set(state => ({ a: state.a + 1 }))
  }
  const updateB = () => {
    set(state => ({ b: state.b + 2 }))
  }
  return { a: 0, b: 0, updateA, updateB }
})

export function App() {
  return (
    <div>
      <A />
      <B />
      <C />
    </div>
  )
}

function A() {
  const a = useStore(state => {
    console.log(state)
    return `Hello: ${state.a}`
  })
  return <h2>{a}</h2>
}

function B() {
  const b = useStore(state => {
    console.log(state)
    return `Hi: ${state.b}`
  })
  return <h2>{b}</h2>
}

function C() {
  const updateA = useStore(v => v.updateA)
  const updateB = useStore(v => v.updateB)

  // const [updateA, updateB] = useStore(
  //   useShallow(v => [v.updateA, v.updateB])
  // )

  return (
    <div style={{ marginTop: '100px', display: 'flex', gap: '10px' }}>
      <button type="butotn" onClick={() => updateA()}>
        update a
      </button>
      <button type="butotn" onClick={() => updateB()}>
        update b
      </button>
    </div>
  )
}
