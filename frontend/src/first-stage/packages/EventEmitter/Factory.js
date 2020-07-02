export default class Facroty {
  constructor(classToCreate, ...deps) {
    this._classToCreate = classToCreate
    this._deps = deps
  }

  create(...paramsForClassToCreate) {
    const createdDeps = this._createDeps()
    const allParams = [
      ...paramsForClassToCreate,
      ...createdDeps
    ]

    return new this._classToCreate(...allParams)
  }

  _createDeps() {
    const createdDeps = []
    for (const dependency of this._deps) {
      let createdDependency

      if (dependency.prototype === undefined) {
        createdDependency = dependency
      } else {
        createdDependency = new dependency()
      }

      createdDeps.push(createdDependency)
    }
    
    return createdDeps
  }
}