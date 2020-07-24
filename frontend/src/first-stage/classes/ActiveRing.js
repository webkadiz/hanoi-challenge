import Ring from "./Ring.js"

export default class ActiveRing {
  ring = false

  get() {
    return this.ring
  }

  set(ring) {
    if (ring instanceof Ring) {
      this.ring = ring
    } else {
      throw new Error("ring mus be instance of Ring")
    }
  }

  exists() {
    return this.ring !== false
  }

  empty() {
    return this.ring === false
  }

  unset() {
    this.ring = false
  }
}
