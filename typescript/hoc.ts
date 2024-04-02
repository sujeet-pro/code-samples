type CachedFunction<T extends (...args: any[]) => any> = (key: string, ...args: Parameters<T>) => ReturnType<T>

function cached<T extends (...args: any[]) => any>(fetcher: T): CachedFunction<T> {
    const cache = new Map()
    return (key: string, ...args) => {
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

async function fetchA(id: string): Promise<{ dataA: string }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                dataA: `Some data for id ${id}`
            })
        }, 1000)
    })
}
async function fetchB(id: number): Promise<{ dataB: string }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                dataB: `Some data for id number ${id}`
            })
        }, 1000)
    })
}

const cachedFetchedA = cached(fetchA)
const cachedFetchedB = cached(fetchB)

async function init() {
    const a = await cachedFetchedA('key1', 'id1')
    const b = await cachedFetchedB('key2', 1)
}