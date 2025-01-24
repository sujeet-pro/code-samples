import { LruCache } from './lru-cache-using-map'

describe('LruCache', () => {
  it('should initialize an empty cache', () => {
    const cache = new LruCache()
    expect(cache.has('key')).toBe(false)
  })

  it('should initialize a cache with entries', () => {
    const entries = [
      ['key1', 'value1'],
      ['key2', 'value2'],
    ] as [string, unknown][]
    const cache = new LruCache(5, entries)
    expect(cache.has('key1')).toBe(true)
    expect(cache.has('key2')).toBe(true)
  })

  it('should throw an error if entries exceed maxSize', () => {
    const entries = [
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
    ] as [string, unknown][]
    expect(() => new LruCache(2, entries)).toThrow(
      'Cache size cannot be greater than maxSize',
    )
  })

  it('should set and get values', () => {
    const cache = new LruCache()
    cache.set('key', 'value')
    expect(cache.get('key')).toBe('value')
  })

  it('should return undefined for non-existent keys', () => {
    const cache = new LruCache()
    expect(cache.get('nonExistentKey')).toBeUndefined()
  })

  it('should delete the least recently used item when maxSize is exceeded', () => {
    const cache = new LruCache(2)
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.set('key3', 'value3')
    expect(cache.has('key1')).toBe(false)
    expect(cache.has('key2')).toBe(true)
    expect(cache.has('key3')).toBe(true)
  })

  it('should update the recently used order when getting a value', () => {
    const cache = new LruCache(2)
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.get('key1')
    cache.set('key3', 'value3')
    expect(cache.has('key1')).toBe(true)
    expect(cache.has('key2')).toBe(false)
    expect(cache.has('key3')).toBe(true)
  })
})
