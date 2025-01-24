import { wait1, wait2, wait } from './wait.utility'

describe('wait1', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now()
    await wait1(100)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(100)
  })
})

describe('wait2', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now()
    await wait2(100)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(100)
  })

  it('should reject if the signal is aborted', async () => {
    const controller = new AbortController()
    const promise = wait2(100, controller.signal)
    controller.abort()
    await expect(promise).rejects.toThrow('Operation aborted')
  })
})

describe('wait', () => {
  it('should resolve after the specified time', async () => {
    const start = Date.now()
    await wait(100)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(100)
  })

  it('should reject if the signal is aborted', async () => {
    const controller = new AbortController()
    const promise = wait(100, controller.signal)
    controller.abort()
    await expect(promise).rejects.toThrow('Operation aborted')
  })
})
