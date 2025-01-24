import { MyPromise } from './promise.polyfill'

describe('MyPromise', () => {
  test('should resolve with a value', async () => {
    const promise = new MyPromise<string>((resolve) => {
      resolve('test value')
    })
    const thenFn = jest.fn()
    promise.then(thenFn)

    expect(thenFn).toHaveBeenCalledWith('test value')
  })

  test('should reject with a reason', async () => {
    const promise = new MyPromise<string>((_, reject) => {
      reject('test reason')
    })

    expect(promise).rejects.toBe('test reason')
  })

  test('should resolve with a delayed value', async () => {
    const promise = new MyPromise<string>((resolve) => {
      setTimeout(() => {
        resolve('test value')
      }, 10)
    })
    const thenFn = jest.fn()
    await promise.then(thenFn)

    expect(thenFn).toHaveBeenCalledWith('test value')
  })

  test('should reject with a delayed reason', async () => {
    const promise = new MyPromise<string>((_, reject) => {
      setTimeout(() => {
        reject('test reason')
      }, 10)
    })

    await expect(promise).rejects.toBe('test reason')
  })

  test('should chain then calls', async () => {
    const promise = new MyPromise<number>((resolve) => {
      resolve(1)
    })

    const result = await promise
      .then((value) => value + 1)
      .then((value) => value * 2)

    expect(result).toBe(4)
  })

  test('should handle errors in then', async () => {
    const promise = new MyPromise<number>((resolve) => {
      resolve(1)
    })

    const result = await promise
      .then(() => {
        throw new Error('test error')
      })
      .catch((error) => error.message)

    expect(result).toBe('test error')
  })

  test('should call finally after resolution', async () => {
    const finallyFn = jest.fn()
    const promise = new MyPromise<string>((resolve) => {
      resolve('test value')
    })

    await promise.finally(finallyFn)

    expect(finallyFn).toHaveBeenCalled()
  })

  test('should call finally after rejection', async () => {
    const finallyFn = jest.fn()
    const promise = new MyPromise<string>((_, reject) => {
      reject('test reason')
    })

    await promise.catch(() => {}).finally(finallyFn)

    expect(finallyFn).toHaveBeenCalled()
  })

  test('MyPromise.resolve should resolve with a value', async () => {
    const promise = MyPromise.resolve('test value')

    await expect(promise).resolves.toBe('test value')
  })

  test('MyPromise.reject should reject with a reason', async () => {
    const promise = MyPromise.reject('test reason')

    await expect(promise).rejects.toBe('test reason')
  })

  test('MyPromise.all should resolve with an array of values', async () => {
    const promises = [
      MyPromise.resolve(1),
      MyPromise.resolve(2),
      MyPromise.resolve(3),
    ]

    const result = await MyPromise.all(promises)

    expect(result).toEqual([1, 2, 3])
  })

  test('MyPromise.all should reject if one of the promises rejects', async () => {
    const promises = [
      MyPromise.resolve<unknown>(1),
      MyPromise.reject<unknown>('test reason'),
      MyPromise.resolve<unknown>(3),
    ]

    await expect(MyPromise.all(promises)).rejects.toBe('test reason')
  })
})
