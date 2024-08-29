import { useState, useDeferredValue, memo } from 'react'
import { block } from '../../utils/lang'

export function App() {
  const [search, setSearch] = useState('')
  const deferedSearch = useDeferredValue(search)
  console.log('render app:', search, deferedSearch)
  return (
    <div>
      <h1>useTransition: Two</h1>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      <SearchResult search={deferedSearch} />
    </div>
  )
}

type SearchResultProps = {
  search: string
}

function SearchResult({ search }: SearchResultProps) {
  console.log('render search', search)
  block(10)
  return <div>{search}</div>
}
