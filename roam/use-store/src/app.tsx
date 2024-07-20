import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App as Counter1 } from './counter-01'
import { App as Counter2 } from './counter-02'
import { App as Counter3 } from './counter-03'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/1" element={<Counter1 />} />
        <Route path="/2" element={<Counter2 />} />
        <Route path="/3" element={<Counter3 />} />
      </Routes>
    </BrowserRouter>
  )
}
