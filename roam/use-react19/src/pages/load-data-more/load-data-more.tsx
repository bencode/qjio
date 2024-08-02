import { useState, Suspense, use } from 'react'
import { range } from '../../utils/lang'

type Product = { id: number; name: string }
type ListData = Promise<Product[]>

export function App() {
  const [page, setPage] = useState(0)
  const [lists, setLists] = useState<ListData[]>(() => [loadProducts(page)])

  const loadMore = () => {
    setPage(v => v + 1)
    setLists(prev => [...prev, loadProducts(page + 1)])
  }

  return (
    <div>
      <ul>
        {lists.map((list, index) => (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            <List key={index} data={list} />
          </Suspense>
        ))}
      </ul>
      <button onClick={() => loadMore()}>Load More</button>
    </div>
  )
}

type ListProps = {
  data: Promise<Product[]>
}

const List = ({ data }: ListProps) => {
  const list = use(data)
  return (
    <>
      {list.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </>
  )
}

async function loadProducts(page: number) {
  const pageSize = 10
  const list = range(pageSize).map(index => {
    const id = pageSize * page + index + 1
    return { id, name: `item: ${id}` }
  })
  return list
}
