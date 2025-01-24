type Task<T> = (data: T) => void

export class PubSub<T> {
  #subscribers = new Set<Task<T>>()
  constructor() {}

  subscribe(task: Task<T>) {
    this.#subscribers.add(task)

    return () => {
      this.#subscribers.delete(task)
    }
  }

  unsubscribe(task: Task<T>) {
    this.#subscribers.delete(task)
  }

  clearSubscribers() {
    this.#subscribers.clear()
  }

  notify(data: T) {
    for (const subscriber of this.#subscribers) {
      try {
        subscriber(data)
      } catch (error) {
        console.error('Error in subscriber:', error)
      }
    }
  }
}
