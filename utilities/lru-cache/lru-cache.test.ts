import { LRUCache } from './lru-cache'

describe('LRUCache', () => {
  it('should return undefined for non-existent keys', () => {
    const cache = new LRUCache<string, number>(2)
    expect(cache.get('a')).toBeUndefined()
  })

  it('should store and retrieve values', () => {
    const cache = new LRUCache<string, number>(2)
    cache.put('a', 1)
    expect(cache.get('a')).toBe(1)
  })

  it('should evict the least recently used item when capacity is exceeded', () => {
    const cache = new LRUCache<string, number>(2)
    cache.put('a', 1)
    cache.put('b', 2)
    cache.put('c', 3) // 'a' should be evicted
    expect(cache.get('a')).toBeUndefined()
    expect(cache.get('b')).toBe(2)
    expect(cache.get('c')).toBe(3)
  })

  it('should update the value of an existing key', () => {
    const cache = new LRUCache<string, number>(2)
    cache.put('a', 1)
    cache.put('a', 2)
    expect(cache.get('a')).toBe(2)
  })

  it('should move the accessed item to the head', () => {
    const cache = new LRUCache<string, number>(2)
    cache.put('a', 1)
    cache.put('b', 2)
    cache.get('a') // 'b' should be the least recently used now
    cache.put('c', 3) // 'b' should be evicted
    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('a')).toBe(1)
    expect(cache.get('c')).toBe(3)
  })
})
