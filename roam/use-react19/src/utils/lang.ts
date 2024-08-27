export const sleep = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const range = (n: number) => {
  return [...Array(n).keys()]
}

export function block(ms: number) {
  const last = Date.now()
  // eslint-disable-next-line
  while (true) {
    const now = Date.now()
    if (now - last > ms) {
      break
    }
  }
}
