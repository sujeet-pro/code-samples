import { PubSub } from './pub-sub.pattern'

describe('PubSub', () => {
  let pubSub: PubSub<string>

  beforeEach(() => {
    pubSub = new PubSub<string>()
  })

  test('should subscribe and notify subscribers', () => {
    const subscriber = jest.fn()
    pubSub.subscribe(subscriber)

    pubSub.notify('test data')

    expect(subscriber).toHaveBeenCalledWith('test data')
  })

  test('should unsubscribe a subscriber', () => {
    const subscriber = jest.fn()
    const unsubscribe = pubSub.subscribe(subscriber)

    unsubscribe()
    pubSub.notify('test data')

    expect(subscriber).not.toHaveBeenCalled()
  })

  test('should clear all subscribers', () => {
    const subscriber1 = jest.fn()
    const subscriber2 = jest.fn()
    pubSub.subscribe(subscriber1)
    pubSub.subscribe(subscriber2)

    pubSub.clearSubscribers()
    pubSub.notify('test data')

    expect(subscriber1).not.toHaveBeenCalled()
    expect(subscriber2).not.toHaveBeenCalled()
  })

  test('should handle errors in subscribers gracefully', () => {
    const errorSubscriber = jest.fn(() => {
      throw new Error('Subscriber error')
    })
    const normalSubscriber = jest.fn()
    pubSub.subscribe(errorSubscriber)
    pubSub.subscribe(normalSubscriber)

    pubSub.notify('test data')

    expect(errorSubscriber).toHaveBeenCalledWith('test data')
    expect(normalSubscriber).toHaveBeenCalledWith('test data')
  })
})
