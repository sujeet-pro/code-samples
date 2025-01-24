export function cacheFunction<T extends (...args: any) => any>(fetcher: T) {
  const cache = new Map()
  return (key: string, ...args: Parameters<T>): ReturnType<T> => {
    if (cache.has(key)) return cache.get(key)
    try {
      const res = fetcher(...args)
      cache.set(key, res)
      return res
    } catch (err) {
      cache.delete(key)
      throw new Error('Failed to fetch', { cause: err })
    }
  }
}
export function cacheAsyncFunction<T extends (...args: any) => Promise<any>>(
  fetcher: T,
) {
  const cache = new Map<string, Promise<ReturnType<T>>>()
  return async (
    key: string,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> => {
    if (cache.has(key)) return cache.get(key)!
    const promise = fetcher(...args)
    cache.set(key, promise)
    try {
      const res = await promise
      return res
    } catch (err) {
      cache.delete(key)
      throw new Error('Failed to fetch', { cause: err })
    }
  }
}
