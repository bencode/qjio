import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App as Counter1 } from './counter-01'
import { App as Counter2 } from './counter-02'
import { App as Counter3 } from './counter-03'
import { App as Counter4 } from './counter-04'
import { App as Ext1 } from './ext-01'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/1" element={<Counter1 />} />
        <Route path="/2" element={<Counter2 />} />
        <Route path="/3" element={<Counter3 />} />
        <Route path="/4" element={<Counter4 />} />
        <Route path="/4" element={<Counter4 />} />
        <Route path="/5" element={<Ext1 />} />
      </Routes>
    </BrowserRouter>
  )
}
