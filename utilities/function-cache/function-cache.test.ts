import { cacheFunction, cacheAsyncFunction } from './function-cache'

describe('cacheFunction', () => {
  it('should cache the result of the fetcher function', () => {
    const fetcher = jest.fn((x: number) => x * 2)
    const cachedFetcher = cacheFunction(fetcher)

    const result1 = cachedFetcher('key1', 2)
    const result2 = cachedFetcher('key1', 2)

    expect(result1).toBe(4)
    expect(result2).toBe(4)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('should call the fetcher function again if the key is different', () => {
    const fetcher = jest.fn((x: number) => x * 2)
    const cachedFetcher = cacheFunction(fetcher)

    const result1 = cachedFetcher('key1', 2)
    const result2 = cachedFetcher('key2', 2)

    expect(result1).toBe(4)
    expect(result2).toBe(4)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('should throw an error and delete the cache if the fetcher function throws an error', () => {
    const fetcher = jest.fn(() => {
      throw new Error('fetcher error')
    })
    const cachedFetcher = cacheFunction(fetcher)

    expect(() => cachedFetcher('key1')).toThrow('Failed to fetch')
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(() => cachedFetcher('key1')).toThrow('Failed to fetch')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})

describe('cacheAsyncFunction', () => {
  it('should cache the result of the async fetcher function', async () => {
    const fetcher = jest.fn(async (x: number) => x * 2)
    const cachedFetcher = cacheAsyncFunction(fetcher)

    const result1 = await cachedFetcher('key1', 2)
    const result2 = await cachedFetcher('key1', 2)

    expect(result1).toBe(4)
    expect(result2).toBe(4)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('should call the async fetcher function again if the key is different', async () => {
    const fetcher = jest.fn(async (x: number) => x * 2)
    const cachedFetcher = cacheAsyncFunction(fetcher)

    const result1 = await cachedFetcher('key1', 2)
    const result2 = await cachedFetcher('key2', 2)

    expect(result1).toBe(4)
    expect(result2).toBe(4)
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('should throw an error and delete the cache if the async fetcher function throws an error', async () => {
    const fetcher = jest.fn(async () => {
      throw new Error('fetcher error')
    })
    const cachedFetcher = cacheAsyncFunction(fetcher)

    await expect(cachedFetcher('key1')).rejects.toThrow('Failed to fetch')
    expect(fetcher).toHaveBeenCalledTimes(1)
    await expect(cachedFetcher('key1')).rejects.toThrow('Failed to fetch')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
