export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const node = document.createElement('script')
    node.onload = () => resolve(undefined)
    node.onerror = e => reject(e)
    node.src = url
    node.async = true
    document.body.appendChild(node)
  })
}
