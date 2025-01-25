export async function exponentialBackoffRetryRecursive<T>(
  asyncFunction: () => Promise<T>,
  retries: number,
  delay: number,
  attempt: number = 0,
  signal?: AbortSignal,
): Promise<T> {
  if (signal?.aborted) {
    throw new Error('Operation aborted')
  }

  try {
    return await asyncFunction()
  } catch (error) {
    if (attempt >= retries) {
      throw error
    }
    await wait(delay * Math.pow(2, attempt), signal)
    return exponentialBackoffRetryRecursive(
      asyncFunction,
      retries,
      delay,
      attempt + 1,
      signal,
    )
  }
}

export async function exponentialBackoffRetryIterative<T>(
  asyncFunction: () => Promise<T>,
  retries: number,
  delay: number,
  signal?: AbortSignal,
): Promise<T> {
  let attempt = 0

  while (attempt <= retries) {
    if (signal?.aborted) {
      throw new Error('Operation aborted')
    }

    try {
      return await asyncFunction()
    } catch (error) {
      attempt++
      if (attempt > retries) {
        throw error
      }
      await wait(delay * Math.pow(2, attempt))
    }
  }

  throw new Error('Max retries reached')
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
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

// // Example usage
// async function exampleAsyncFunction(): Promise<string> {
//   // Simulate an async operation that may fail
//   if (Math.random() < 0.7) {
//     throw new Error('Random failure')
//   }
//   return 'Success'
// }

// exponentialBackoffRetry(exampleAsyncFunction, 5, 1000)
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error))
