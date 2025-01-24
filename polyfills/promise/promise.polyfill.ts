/* eslint-disable @typescript-eslint/no-explicit-any */
type Callback<T, R> = (value: T) => R

type Task<T> = Callback<T, void>
type ErrorCallback = (reason?: any) => void
type CallbackWithPromise<T, R> = (value: T) => R | MyPromise<R>

export class MyPromise<T> {
  private callbacks: Array<Task<T>> = []
  private errorCallbacks: Array<ErrorCallback> = []
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending'
  private value: T | null = null
  private reason: unknown = null

  constructor(
    executor: (
      resolve: (value: T | MyPromise<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    const resolve = (value: T | MyPromise<T>) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        if (value instanceof MyPromise) {
          value.then(resolve, reject)
        } else {
          this.value = value
          this.callbacks.forEach((callback) => {
            callback(value)
          })
        }
      }
    }

    const reject = (reason: unknown) => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.errorCallbacks.forEach((callback) => {
          callback(reason)
        })
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: CallbackWithPromise<T, TResult1> | undefined | null,
    onRejected?: CallbackWithPromise<any, TResult2> | undefined | null,
  ): MyPromise<TResult1 | TResult2> {
    return new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      const handleFulfilled: Task<T> = (value) => {
        try {
          if (onFulfilled) {
            const result = onFulfilled(value)
            if (result instanceof MyPromise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          }
        } catch (error) {
          reject(error)
        }
      }

      const handleRejected: ErrorCallback = (reason: unknown) => {
        if (onRejected) {
          try {
            const result = onRejected(reason)
            if (result instanceof MyPromise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (error) {
            reject(error)
          }
        } else {
          reject(reason)
        }
      }

      if (this.state === 'fulfilled') {
        handleFulfilled(this.value!)
      } else if (this.state === 'rejected') {
        handleRejected(this.reason)
      } else {
        this.callbacks.push(handleFulfilled)
        this.errorCallbacks.push(handleRejected)
      }
    })
  }

  catch<TResult = never>(
    onRejected?:
      | ((reason: any) => TResult | MyPromise<TResult>)
      | undefined
      | null,
  ): MyPromise<TResult> {
    if (!onRejected) {
      return MyPromise.reject(this.reason)
    }
    return this.then(undefined, onRejected)
  }

  finally(onFinally: () => void): MyPromise<T> {
    return this.then(
      (value) => {
        onFinally()
        return value
      },
      (reason) => {
        onFinally()
        throw reason
      },
    )
  }

  static resolve<U>(value: U): MyPromise<U> {
    return new MyPromise<U>((resolve) => resolve(value))
  }

  static reject<U>(reason: unknown): MyPromise<U> {
    return new MyPromise<U>((_, reject) => reject(reason))
  }

  static all<U>(promises: MyPromise<U>[]): MyPromise<U[]> {
    return new MyPromise<U[]>((resolve, reject) => {
      let resolvedCount = 0
      const results: U[] = []

      promises.forEach((promise, index) => {
        promise
          .then((value) => {
            resolvedCount++
            results[index] = value
            if (resolvedCount === promises.length) {
              resolve(results)
            }
          })
          .catch(reject)
      })
    })
  }
}
