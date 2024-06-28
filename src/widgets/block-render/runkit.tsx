import { Block } from '@/core/types'

export type RunkitRenderProps = {
  block: Block
}

export const RunkitRender = ({ block }: RunkitRenderProps) => {
  console.log('----------------', block)
  return <div>RunKit!</div>
}
