import { App as LoadData } from './pages/c1-load-data'
import { App as LoadDataSuspense } from './pages/c2-load-data-suspense'
import { App as LoadDataSuspense2 } from './pages/c3-load-data-suspense'
import { App as LoadDataSuspense3 } from './pages/c4-load-data-suspense'
import { App as LoadDataSuspense4 } from './pages/c5-load-data'

export function App() {
  return (
    <div>
      <h2>Load data</h2>
      <div>
        <LoadData />
      </div>
      <h2>Load data use Suspense</h2>
      <div>
        <LoadDataSuspense />
      </div>
      <h2>Load data use Suspense refactor</h2>
      <div>
        <LoadDataSuspense2 />
      </div>
      <h2>Load data use Suspense refactor</h2>
      <div>
        <LoadDataSuspense3 />
      </div>
      <h2>Load data</h2>
      <div>
        <LoadDataSuspense4 />
      </div>
    </div>
  )
}
