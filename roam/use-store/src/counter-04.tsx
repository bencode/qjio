import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useStore = create(set => {
  const update = name => {
    set(state => {
      return { [name]: (state[name] ?? 0) + 1 }
    })
  }
  return { update }
})

export function App() {
  return (
    <div>
      <Item name="a" />
      <Item name="b" />
      <Item name="c" />
      <AB />
      <Actions />
    </div>
  )
}

function Item({ name }) {
  const value = useStore(state => {
    return state[name]
  })
  return (
    <h2>
      {name}: {value}
    </h2>
  )
}

function AB() {
  const { a, b } = useStore(state => {
    return { a: state.a, b: state.b }
  })
  return (
    <h2>
      a: {a}, b: {b}
    </h2>
  )
}

function Actions() {
  const update = useStore(v => v.update)

  return (
    <div style={{ marginTop: '100px', display: 'flex', gap: '10px' }}>
      <button type="butotn" onClick={() => update('a')}>
        update a
      </button>
      <button type="butotn" onClick={() => update('b')}>
        update b
      </button>
      <button type="butotn" onClick={() => update('c')}>
        update b
      </button>
    </div>
  )
}
