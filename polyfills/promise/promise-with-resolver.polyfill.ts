type Resolver<T = any> = {
  promise: Promise<T>
  resolver: (value: T | PromiseLike<T>) => void
  rejecter: (reason?: any) => void
}

export function promiseWithResolver<T>(): Resolver<T> {
  const out: Partial<Resolver> = {}
  out.promise = new Promise((resolve, reject) => {
    out.resolver = resolve
    out.rejecter = reject
  })

  return out as Resolver<T>
}
