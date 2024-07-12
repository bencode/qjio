import { App as LoadData } from './pages/c1-load-data'
import { App as LoadDataSuspense  } from './pages/c2-load-data-suspense'

export function App() {
  return (
    <div>
      <div><LoadData /></div>
      <div><LoadDataSuspense /></div>
    </div>
  )
}
