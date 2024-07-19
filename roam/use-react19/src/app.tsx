import { App as LoadDataOnce } from './pages/load-data-once'
import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom'
import { css } from '@emotion/css'
import './style.css'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/load-data-once" element={<LoadDataOnce />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export function Home() {
  return <h1>Start to use react19 </h1>
}

function Layout() {
  const style = css`
    display: flex;
    > .left {
      width: 200px;
    }
  `
  return (
    <div className={style}>
      <ul className="left">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/load-data-once">Load data once</Link>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
