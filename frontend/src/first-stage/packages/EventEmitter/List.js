export default class List {
  constructor() {
    this._list = []
  }

  create(initVal) {
    if (Array.isArray(initVal)) this._list = initVal
    else if (initVal === undefined) this._list = []
    else throw new Error()
    return this
  }

  add(item) {
    this._list.push(item)
    return this
  }

  clear() {
    this.create()
    return this
  }

  remove(item) {
    const itemArr = this._list.filter(_item => _item !== item)
    this.create(itemArr)
    return this
  }

  get(item) {
    const itemArr = this._list.filter(_item => _item === item)
    
    if (itemArr.length) return itemArr
    else return false
  }

  getAll() {
    return this._list
  }

  length() {
    return this._list.length
  }
}