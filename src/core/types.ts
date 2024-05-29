export type Block = {
  type: string
  key?: string
  name?: string
  props: Record<string, unknown>
  body: unknown
  children: Block[]
  refs: (BlockRef | Block)[]
}

export type BlockRef = {
  type: '$ref',
  key?: string
  name?: string
}
