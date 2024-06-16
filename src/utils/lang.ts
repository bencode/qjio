export type Dict = Record<string, unknown>

export function isObject(value: unknown): value is Dict {
  return Object.prototype.toString.call(value) === '[object Object]'
}
