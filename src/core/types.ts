export type Dict = Record<string, unknown>

export type Block = {
  type: string
  key?: string
  name?: string
  title?: string
  props: Record<string, unknown>
  body?: string
  children: (Block | BlockRef)[]
  refs: BlockRef[]
}

export type BlockRef = {
  type: '$ref'
  key?: string
  name?: string
}
