import { useEffect, useState } from 'react'
import { range, sleep } from '../../utils/lang'

type PagingData<T> = {
  page: number
  total: number
  records: T[]
}

type Product = {
  id: number
  name: string
}

export function App() {
  const [loading, setLoading] = useState(false)
  const [paging, setPaging] = useState<PagingData<Product>>()

  const load = async (page: number) => {
    setLoading(true)
    try {
      const res = await loadProducts(page)
      setPaging(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(1)
  }, [])

  const handlePageChange = (page: number) => {
    load(page)
  }

  return (
    <div>
      {paging ? (
        <List
          loading={loading}
          pagination={{ ...paging, pageSize: 10 }}
          dataSource={paging.records}
          onPageChange={handlePageChange}
        />
      ) : null}
    </div>
  )
}

type ListProps = {
  loading: boolean
  pagination: Pagination
  dataSource: Product[]
  onPageChange?: (page: number) => void
}

type Pagination = {
  total: number
  page: number
  pageSize: number
}

const List = ({ loading, pagination, dataSource, onPageChange }: ListProps) => {
  const { page, total, pageSize } = pagination
  const pageCount = Math.ceil(total / pageSize)
  return (
    <div>
      <ul>
        {dataSource.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>Total: {total}</span>
        <span>
          Page: {page} / {pageCount}
        </span>
        <button disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
          Previous
        </button>
        <button disabled={page >= pageSize} onClick={() => onPageChange?.(page + 1)}>
          Next
        </button>
        {loading ? <div>Loading...</div> : null}
      </div>
    </div>
  )
}

async function loadProducts(page: number) {
  const pageSize = 10
  await sleep(300)
  const records = range(pageSize).map(index => {
    const id = pageSize * (page - 1) + index + 1
    return { id, name: `item: ${id}` }
  })
  return { page, total: 999, records, pageSize: 10 }
}
