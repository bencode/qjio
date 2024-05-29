export type ExprFn = (ctx: ExprContext) => unknown
export type ExprContext = Record<string, unknown>
export type EvaluatorOptions = {
  throwOnCompileError?: boolean
  throwOnEvalError?: boolean
}

export function createEvaluator(options: EvaluatorOptions = {}) {
  const cache = new Map<string, ExprFn>()
  return (expr: string) => {
    let fn = cache.get(expr)
    if (!fn) {
      fn = compile(expr, options)
      cache.set(expr, fn)
    }
    return fn
  }
}

function compile(expr: string, options: EvaluatorOptions): ExprFn {
  expr = expr || 'undefined'
  const body = options.throwOnEvalError
    ? `with($context) {
      return (${expr});
    }`
    : `with($context) {
      try {
        return (${expr});
      } catch(e) {
        console.error('evaluate expr error: ', e);
        return undefined;
      }
    }`
  try {
    const fn = new Function('$context', body)
    return fn as ExprFn
  } catch (e) {
    if (options.throwOnCompileError) {
      throw e
    }
    window.console.error('compile expression error: ', e)
    window.console.error('SOURCE:\n', body)
    return () => {
      window.console.error('invalid expr called: ', e, expr)
      return undefined
    }
  }
}
