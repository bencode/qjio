export type Block = {
  type: string
  key?: string
  name?: string
  props: Record<string, unknown>
  body: unknown
  children: (Block | BlockRef)[]
  refs: BlockRef[]
}

export type BlockRef = {
  type: '$ref',
  key?: string
  name?: string
}
