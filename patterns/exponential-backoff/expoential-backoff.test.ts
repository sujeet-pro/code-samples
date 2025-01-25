import {
  exponentialBackoffRetryRecursive,
  exponentialBackoffRetryIterative,
} from './exponential-backoff'

describe('exponentialBackoffRetryRecursive', () => {
  it('should resolve if the async function succeeds on the first attempt', async () => {
    const asyncFunction = jest.fn().mockResolvedValue('Success')
    const result = await exponentialBackoffRetryRecursive(asyncFunction, 3, 100)
    expect(result).toBe('Success')
    expect(asyncFunction).toHaveBeenCalledTimes(1)
  })

  it('should retry the specified number of times before succeeding', async () => {
    const asyncFunction = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failure'))
      .mockResolvedValue('Success')
    const result = await exponentialBackoffRetryRecursive(asyncFunction, 3, 100)
    expect(result).toBe('Success')
    expect(asyncFunction).toHaveBeenCalledTimes(2)
  })

  it('should throw an error if the async function fails after the maximum retries', async () => {
    const asyncFunction = jest.fn().mockRejectedValue(new Error('Failure'))
    await expect(
      exponentialBackoffRetryRecursive(asyncFunction, 3, 100),
    ).rejects.toThrow('Failure')
    expect(asyncFunction).toHaveBeenCalledTimes(4)
  })

  it('should abort if the signal is aborted', async () => {
    const asyncFunction = jest.fn().mockRejectedValue(new Error('Failure'))
    const controller = new AbortController()
    controller.abort()
    await expect(
      exponentialBackoffRetryRecursive(
        asyncFunction,
        3,
        100,
        0,
        controller.signal,
      ),
    ).rejects.toThrow('Operation aborted')
    expect(asyncFunction).toHaveBeenCalledTimes(0)
  })
})

describe('exponentialBackoffRetryIterative', () => {
  it('should resolve if the async function succeeds on the first attempt', async () => {
    const asyncFunction = jest.fn().mockResolvedValue('Success')
    const result = await exponentialBackoffRetryIterative(asyncFunction, 3, 100)
    expect(result).toBe('Success')
    expect(asyncFunction).toHaveBeenCalledTimes(1)
  })

  it('should retry the specified number of times before succeeding', async () => {
    const asyncFunction = jest
      .fn()
      .mockRejectedValueOnce(new Error('Failure'))
      .mockResolvedValue('Success')
    const result = await exponentialBackoffRetryIterative(asyncFunction, 3, 100)
    expect(result).toBe('Success')
    expect(asyncFunction).toHaveBeenCalledTimes(2)
  })

  it('should throw an error if the async function fails after the maximum retries', async () => {
    const asyncFunction = jest.fn().mockRejectedValue(new Error('Failure'))
    await expect(
      exponentialBackoffRetryIterative(asyncFunction, 3, 100),
    ).rejects.toThrow('Failure')
    expect(asyncFunction).toHaveBeenCalledTimes(4)
  })

  it('should abort if the signal is aborted', async () => {
    const asyncFunction = jest.fn().mockRejectedValue(new Error('Failure'))
    const controller = new AbortController()
    controller.abort()
    await expect(
      exponentialBackoffRetryIterative(
        asyncFunction,
        3,
        100,
        controller.signal,
      ),
    ).rejects.toThrow('Operation aborted')
    expect(asyncFunction).toHaveBeenCalledTimes(0)
  })
})
