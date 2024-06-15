import { marked } from 'marked'

export type MarkedBodyProps = {
  value: string
}

export const MarkedBody = ({ value }: MarkedBodyProps) => {
  const html = marked.parse(value)
  const style = `
    prose prose-blue max-w-none
    prose-headings:mt-4 prose-headings:mb-2
    prose-p:my-1
    prose-img:my-4 prose-img:max-w-full lg:prose-img:max-w-[600px]
`
  return (
    <div className={style}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
