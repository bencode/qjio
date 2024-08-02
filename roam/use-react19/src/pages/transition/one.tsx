import { useState, useTransition } from 'react'
import { css } from '@emotion/css'

export function App() {
  return (
    <div>
      <h1>useTransition: One</h1>
      <TabApp />
    </div>
  )
}

function TabApp() {
  const [tab, setTab] = useState('a')
  const [loading, startTransition] = useTransition()

  const style = css`
    nav {
      display: flex;
      margin-bottom: 10px;

      ul,
      li {
        display: block;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      ul {
        display: flex;
        padding: 0 20px;
      }

      li {
        padding: 0 10px;
        &:hover {
          cursor: pointer;
          color: blue;
        }
      }
    }

    .body {
      margin: 20px 20px 0 0;
      padding: 20px;
      border: 1px dotted blue;
    }
  `

  const setTabInTransition = (next: string) => {
    startTransition(() => {
      setTab(next)
    })
  }

  return (
    <div className={style}>
      <section>
        <h2>navigate</h2>
        <nav>
          Navs:
          <ul>
            <li onClick={() => setTab('a')}>A</li>
            <li onClick={() => setTab('b')}>Slow B</li>
            <li onClick={() => setTab('c')}>C</li>
          </ul>
        </nav>
      </section>
      <section>
        <h2>navigate use transition</h2>
        <nav>
          Navs:
          <ul>
            <li onClick={() => setTabInTransition('a')}>A</li>
            <li onClick={() => setTabInTransition('b')}>Slow B</li>
            <li onClick={() => setTabInTransition('c')}>C</li>
          </ul>
        </nav>
      </section>
      <section>
        <h2>Body</h2>
        <div>tab: {tab}</div>
        <div>{loading ? <span>transition...</span> : null}</div>
        <div className="body">
          {tab === 'a' ? <A /> : null}
          {tab === 'b' ? <B /> : null}
          {tab === 'c' ? <C /> : null}
        </div>
      </section>
    </div>
  )
}

function A() {
  return <div>A</div>
}

function B() {
  block(1000)
  return <div>I was blocked for 1000ms</div>
}

function C() {
  return <div>C</div>
}

function block(ms: number) {
  const last = Date.now()
  while (true) {
    const now = Date.now()
    if (now - last > ms) {
      break
    }
  }
}
