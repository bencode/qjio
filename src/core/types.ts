export type Block = {
  type: string
  id: string
  name?: string
  props: Record<string, unknown>
  body: Element[]
  refs: (BlockRef | Block)[]
}

type BlockRef = {
  type: 'ref',
  id?: string
  name?: string
}

export type Element = {
  name: string
  props: Record<string, unknown>
  children: Element[]
}
