type ResolvFn<T = unknown> = (value: T) => void
type RejectFn<E = unknown> = (error: E) => void
type OnResolved<T = unknown, V = unknown> = (val: T) => V
type OnRejected<V = unknown> = (error: unknown) => V

type PromiseExecutor<T> = (
    resolve: ResolvFn<T>,
    reject: RejectFn
) => void

type PromiseInternalCallback = {
    resolve: ResolvFn<any>
    reject: RejectFn
} & ({
    type: 'then'
    onFulfilled: OnResolved<any, any>
    onRejected?: OnRejected
} | {
    type: 'finally'
    onFinally: (() => void);
} | {
    type: 'catch'
    onCatch: OnRejected
})



export class PromisePolyfill<T> {
    #state: 'pending' | 'fulfilled' | 'rejected' = 'pending'
    #value: T | null = null
    #error: unknown
    #callbacks: PromiseInternalCallback[] = []

    static resolve<V>(value: V) {
        return new PromisePolyfill<V>((resolve) => {
            queueMicrotask(() => {
                resolve(value)
            })
        })
    }
    static reject(err: unknown) {
        return new PromisePolyfill((_, reject) => {
            queueMicrotask(() => {
                reject(err)
            })
        })
    }

    constructor(executor: PromiseExecutor<T>) {
        const resolve = this.#resolve.bind(this)
        const reject = this.#reject.bind(this)
        executor(resolve, reject)
    }

    #resolve(value: T): void {
        if (this.#state !== 'pending') return;
        this.#state = 'fulfilled'
        this.#value = value
        this.#executeCallbacks()
    }
    #reject(reason: unknown): void {
        if (this.#state !== 'pending') return;
        this.#state = 'rejected'
        this.#error = reason
        this.#executeCallbacks()
    }

    #executeCallback(callback: PromiseInternalCallback) {
        if (this.#state === 'pending') {
            this.#callbacks.push(callback)
            return
        }
        if (callback.type === 'finally') {
            callback.onFinally()
            if (this.#state === 'fulfilled') {
                callback.resolve(this.#value!)
            } else if (this.#state === 'rejected') {
                callback.reject(this.#error)
            }
        } else if (callback.type === 'catch') {
            if (this.#state === 'fulfilled') {
                callback.resolve(this.#value!)
            } else if (this.#state === 'rejected') {
                try {
                    const next = callback.onCatch(this.#error)
                    callback.resolve(next as T)
                } catch (err) {
                    callback.reject(err)
                }
            }
        } else if (callback.type === 'then') {
            try {
                if (this.#state === 'fulfilled') {
                    const next = callback.onFulfilled(this.#value!)
                    callback.resolve(next as T)
                } else if (this.#state === 'rejected') {
                    if (callback.onRejected) {
                        const next = callback.onRejected(this.#error!)
                        callback.resolve(next as T)
                    } else {
                        callback.reject(this.#error)
                    }
                }
            } catch (err) {
                callback.reject(err)
            }
        }
    }

    #executeCallbacks() {
        for (const callback of this.#callbacks) {
            queueMicrotask(() => {
                this.#executeCallback(callback)
            })
        }
    }

    then<T2>(
        onFulfilled: OnResolved<T, T2>,
        onRejected?: OnRejected
    ): PromisePolyfill<T2> {
        return new PromisePolyfill<T2>((resolve, reject) => {
            queueMicrotask(() => {
                this.#executeCallback({
                    type: 'then',
                    onFulfilled,
                    onRejected,
                    resolve,
                    reject
                })
            })
        })
    }

    catch<T2>(
        onCatch: (reason: unknown) => T2 | PromisePolyfill<T2>
    ) {
        return new PromisePolyfill<T2>((resolve, reject) => {
            queueMicrotask(() => {
                this.#executeCallback({
                    type: 'catch',
                    onCatch,
                    resolve,
                    reject
                })
            })
        })
    }

    finally(onFinally: () => void) {
        return new PromisePolyfill<T>((resolve, reject) => {
            queueMicrotask(() => {
                this.#executeCallback({
                    type: 'finally',
                    onFinally,
                    resolve,
                    reject
                })
            })
        })
    }
}