export default class List {
  constructor(initVal) {
    if (Array.isArray(initVal)) this._list = initVal
    else if (initVal === undefined) this._list = []
    else throw new Error()
  }

  add(item) {
    this._list.push(item)
    return this
  }

  clear() {
    this._list = []
    return this
  }

  remove(item) {
    const itemArr = this._list.filter(_item => _item !== item)
    this._list = itemArr
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