import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom'
import { css } from '@emotion/css'
import { App as LoadDataOnce } from './pages/load-data-once'
import { App as LoadDataMore } from './pages/load-data-more'
import './style.css'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/load-data-once" element={<LoadDataOnce />} />
          <Route path="/load-data-more" element={<LoadDataMore />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export function Home() {
  return <h1>Start to use React19 </h1>
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
        <li>
          <Link to="/load-data-more">Load data more</Link>
        </li>
      </ul>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
