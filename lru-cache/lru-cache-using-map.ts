class LruCache<K = string, V = unknown> {
    private cache: Map<K, V>
    constructor(
        private maxSize = 20,
        entries?: [K, V][]
    ) {
        this.cache = new Map(entries)
    }

    get(key: K) {
        const hasKey = this.cache.has(key)
        if(!hasKey) return null
        const value = this.cache.get(key)
        this.cache.delete(key)
        this.set(key, value!)
        return value
    }

    set(key: K, value: V) {
        if(this.cache.size >= this.maxSize) {
            this.cache.delete(this.cache.keys().next().value)
        }
        return this.cache.set(key, value)
    }
}