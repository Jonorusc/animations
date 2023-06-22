function spring(stiffness, mass, damping) {
  const springLength = 1
  const k = -stiffness
  const mass = mass
  const d = -damping
  const frameRate = 1 / 60

  function getPositions(dx, dy) {
    let x = dx
    let y = dy
    let vx = 0
    let vy = 0

    let i = 0
    let positions = []

    while (i < 600) {
      let FspringX = k * (x - springLength)
      let FspringY = k * (y - springLength)
      let FdampingX = d * vx
      let FdampingY = d * vy

      let ax = (FspringX + FdampingX) / mass
      let ay = (FspringY + FdampingY) / mass
      vx += ax * frameRate
      vy += ay * frameRate
      x += vx * frameRate
      y += vy * frameRate

      i++

      positions.push({
        x,
        y,
      })

      return { positions, frames: i }
    }
  }

  return {
    getPositions,
  }
}

export default spring
