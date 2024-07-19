export const sleep = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export const range = (n: number) => {
  return [...Array(n).keys()]
}
