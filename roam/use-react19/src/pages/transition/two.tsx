import { useState, useDeferredValue, Suspense } from 'react'
import { block } from '../../utils/lang'

export function App() {
  const [search, setSearch] = useState('')
  const deferedSearch = useDeferredValue(search)
  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <Suspense fallback={<div>loading...</div>}>
        <SearchResult search={deferedSearch} />
      </Suspense>
    </div>
  )
}

type SearchResultProps = {
  search: string
}

function SearchResult({ search }: SearchResultProps) {
  block(100)
  return <div>{search}</div>
}
