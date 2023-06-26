class Spring {
  constructor(stiffness, mass, damping) {
    this.springLength = 1
    this.k = -stiffness
    this.mass = mass
    this.d = -damping
    this.frameRate = 1 / 60
  }

  getPositions(dx, dy) {
    let x = dx
    let y = dy
    let vx = 0
    let vy = 0

    let i = 0
    let positions = []

    while (i < 600) {
      let FspringX = this.k * (x - this.springLength)
      let FspringY = this.k * (y - this.springLength)
      let FdampingX = this.d * vx
      let FdampingY = this.d * vy

      let ax = (FspringX + FdampingX) / this.mass
      let ay = (FspringY + FdampingY) / this.mass
      vx += ax * this.frameRate
      vy += ay * this.frameRate
      x += vx * this.frameRate
      y += vy * this.frameRate

      i++

      positions.push({
        x,
        y,
      })
    }
    return { positions, frames: i }
  }
}

export default Spring
