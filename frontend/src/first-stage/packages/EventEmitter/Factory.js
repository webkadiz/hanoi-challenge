export default class Facroty {
  constructor(classToCreate, ...deps) {
    this._classToCreate = classToCreate
    this.deps = deps
  }

  create() {
    const createdDeps = []
    for (const dependency of this._depends) {
      const createdDependency = new dependency()
      createdDeps.push(createdDependency)
    }

    return new this._classToCreate(...createdDeps)
  }
}