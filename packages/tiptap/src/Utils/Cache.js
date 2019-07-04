export default class Cache {

  constructor() {
    this.data = []
  }

  add(data) {
    const item = {
      ...data,
      id: this.generateId(),
    }

    this.data.push(item)
    return item
  }

  findById(id) {
    const index = this.data.findIndex(item => item.id === id)
    return this.removeIndex(index)
  }

  findByNode(node) {
    const index = this.data.findIndex(item => JSON.stringify(node) === JSON.stringify(item.node))
    return this.removeIndex(index)
  }

  removeIndex(index) {
    if (index < 0) {
      return null
    }

    const item = this.data[index]

    this.data = [
      ...this.data.slice(0, index),
      ...this.data.slice(index + 1),
    ]

    return item
  }

  generateId() {
    return Math.floor(Math.random() * 0xFFFFFFFF)
  }

}
