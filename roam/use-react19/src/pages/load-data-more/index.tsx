import { App as LoadDataMore } from './load-data-more'
import { App as LoadDataPaging } from './load-data-paging'

export const App = () => {
  return (
    <div>
      <h1>Load data more</h1>
      <section>
        <h2>Load data more</h2>
        <LoadDataMore />
      </section>
      <section>
        <h2>Load data pagination</h2>
        <LoadDataPaging />
      </section>
    </div>
  )
}
