export type Block = {
  type: string
  id?: string
  name?: string
  props: Record<string, Value | null | undefined>
  body?: unknown
  children: (BlockRef | Block)[]
}

type Value = string | number | boolean
type BlockRef = string

export type Element = {
  tag: string
  props: Record<string, Value>
  children: Element[]
}
