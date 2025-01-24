export function wait1(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function wait2(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error('Operation aborted'))
    }

    const timeoutId = setTimeout(resolve, ms)

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId)
      reject(new Error('Operation aborted'))
    })
  })
}

export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  const { promise, reject, resolve } = Promise.withResolvers<void>()
  if (signal?.aborted) {
    reject(new Error('Operation aborted'))
  }
  const timeoutId = setTimeout(resolve, ms)
  signal?.addEventListener('abort', () => {
    clearTimeout(timeoutId)
    reject(new Error('Operation aborted'))
  })
  return promise
}
