export class LRUCache<K, V> {
  private capacity: number
  private cache: Map<K, ListNode<K, V>>
  private list: DoublyLinkedList<K, V>

  constructor(capacity: number) {
    this.capacity = capacity
    this.cache = new Map()
    this.list = new DoublyLinkedList()
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined
    }
    const node = this.cache.get(key)!
    this.list.moveToHead(node)
    return node.value
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      const node = this.cache.get(key)!
      node.value = value
      this.list.moveToHead(node)
    } else {
      const newNode = new ListNode(key, value)
      if (this.cache.size >= this.capacity) {
        const tail = this.list.removeTail()
        if (tail) {
          this.cache.delete(tail.key)
        }
      }
      this.list.addToHead(newNode)
      this.cache.set(key, newNode)
    }
  }
}

class ListNode<K, V> {
  key: K
  value: V
  prev: ListNode<K, V> | null = null
  next: ListNode<K, V> | null = null

  constructor(key: K, value: V) {
    this.key = key
    this.value = value
  }
}

class DoublyLinkedList<K, V> {
  head: ListNode<K, V> | null = null
  tail: ListNode<K, V> | null = null

  addToHead(node: ListNode<K, V>): void {
    node.next = this.head
    node.prev = null
    if (this.head) {
      this.head.prev = node
    }
    this.head = node
    if (!this.tail) {
      this.tail = node
    }
  }

  removeNode(node: ListNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this.head = node.next
    }
    if (node.next) {
      node.next.prev = node.prev
    } else {
      this.tail = node.prev
    }
  }

  removeTail(): ListNode<K, V> | null {
    if (!this.tail) {
      return null
    }
    const tailNode = this.tail
    this.removeNode(tailNode)
    return tailNode
  }

  moveToHead(node: ListNode<K, V>): void {
    if (node === this.head) {
      return
    }
    this.removeNode(node)
    this.addToHead(node)
  }
}
