export type Block = {
  type: string
  id?: string
  name?: string
  props: Record<string, unknown>
  body: unknown
  children: Block[]
  refs: (BlockRef | Block)[]
}

export type BlockRef = {
  type: '$ref',
  id?: string
  name?: string
}
