import Snowflake from "./Snowflake"

export default class Snowfall {
  constructor(selector) {
    this.particles = []
    this.canvas = document.querySelector(selector)
    this.ctx = this.canvas.getContext("2d")

    this.canvas.width = innerWidth
    this.canvas.height = innerHeight

    this.particleCount = 400
    this.particleSize = 3
    this.colors = ["#ccc", "#eee", "#fff", "#ddd"]

    addEventListener("resize", () => {
      this.canvas.width = innerWidth
      this.canvas.height = innerHeight
      this.init()
    })
  }

  randomColor(colors) {
    return this.colors[Math.floor(Math.random() * this.colors.length)]
  }

  randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(
        new Snowflake(
          this.ctx,
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height,
          this.randomIntFromRange(0.5, this.particleSize),
          this.randomColor(),
          Math.random() * 80
        )
      )
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle) => {
      particle.update()
    })
  }
}
