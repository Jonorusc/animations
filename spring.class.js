class Spring {
  constructor(stiffness, mass, damping) {
    this.springLength = 1
    this.k = -stiffness
    this.mass = mass
    this.d = -damping
    this.frameRate = 1 / 60
    this.positions = []
    this.animation = null
  }

  animate(dx, dy, element = null, onAnimateEnd = (e) => {}, fill = "both", easing = "linear", iterations = 1) {
    let x = dx
    let y = dy
    let v = 0

    let i = 0

    while (i < 600) {
      let Fspring = this.k * (x - this.springLength)
      let Fdamping = this.d * v
      let a = (Fspring + Fdamping) / this.mass

      v += a * this.frameRate
      x += v * this.frameRate
      y += v * this.frameRate
      i++

      this.positions.push({
        x,
        y,
      })
    }

    if (element && this.positions.length > 0) {
      const positions = this.positions.map(({ x, y }) => {
        return { transform: `translate(${x}px, ${y}px)` }
      })
      x = 0
      y = 0
      element.style.transform = ""
      const keyframes = new KeyframeEffect(element, positions, {
        duration: (this.positions.length / 60) * 1000,
        fill,
        easing,
        iterations,
      })
      this.animation = new Animation(keyframes)

      element.addEventListener("animationend", (e) => {
        if (!!onAnimateEnd && typeof onAnimateEnd === "function") {
          onAnimateEnd(e)
        }
      })
    }
  }

  play() {
    if (this.animation) {
      this.animation.play()
    }
  }

  stop() {
    if (this.animation) {
      this.animation.cancel()
    }
  }

  positions() {
    return this.positions
  }
}

export default Spring
