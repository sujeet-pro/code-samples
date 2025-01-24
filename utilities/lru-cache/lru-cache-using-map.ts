export class LruCache<K = string, V = unknown> {
  private cache: Map<K, V>
  constructor(
    private maxSize = 20,
    entries?: [K, V][],
  ) {
    if (!entries) {
      this.cache = new Map()
    } else if (entries.length > maxSize) {
      throw new Error('Cache size cannot be greater than maxSize')
    } else {
      this.cache = new Map(entries)
    }
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  set(key: K, value: V) {
    if (this.cache.size >= this.maxSize) {
      const keyToDelete = this.cache.keys().next().value!
      this.cache.delete(keyToDelete)
    }
    return this.cache.set(key, value)
  }
}
