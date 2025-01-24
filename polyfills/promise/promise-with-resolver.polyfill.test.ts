import { promiseWithResolver } from './promise-with-resolver.polyfill'

describe('promiseWithResolver', () => {
  it('should return an object with a promise, resolver, and rejecter', () => {
    const result = promiseWithResolver()

    expect(result).toHaveProperty('promise')
    expect(result).toHaveProperty('resolver')
    expect(result).toHaveProperty('rejecter')
  })

  it('should resolve the promise when resolver is called', async () => {
    const result = promiseWithResolver<number>()
    result.resolver(42)

    await expect(result.promise).resolves.toBe(42)
  })

  it('should reject the promise when rejecter is called', async () => {
    const result = promiseWithResolver<number>()
    const error = new Error('Test error')
    result.rejecter(error)

    await expect(result.promise).rejects.toThrow('Test error')
  })
})
