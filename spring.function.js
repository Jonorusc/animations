function spring(stiffness, mass, damping) {
  let springLength = 1
  let k = -stiffness
  let mass = mass
  let d = -damping
  let frameRate = 1 / 60
  let positions = []
  let animation = null

  function animate(dx, dy, element = null, onAnimateEnd = (e) => {}, fill = "both", easing = "linear", iterations = 1) {
    let x = dx
    let y = dy
    let v = 0

    let i = 0

    while (i < 600) {
      let Fspring = k * (x - springLength)
      let Fdamping = d * v
      let a = (Fspring + Fdamping) / mass

      v += a * frameRate
      x += v * frameRate
      y += v * frameRate
      i++

      positions.push({
        x,
        y,
      })
    }

    if (element && positions.length > 0) {
      const positionsArray = positions.map(({ x, y }) => {
        return { transform: `translate(${x}px, ${y}px)` }
      })
      x = 0
      y = 0
      element.style.transform = ""
      const keyframes = new KeyframeEffect(element, positionsArray, {
        duration: (positions.length / 60) * 1000,
        fill,
        easing,
        iterations,
      })
      animation = new Animation(keyframes)

      element.addEventListener("animationend", (e) => {
        if (!!onAnimateEnd && typeof onAnimateEnd === "function") {
          onAnimateEnd(e)
        }
      })
    }
  }

  function play() {
    if (animation) {
      animation.play()
    }
  }

  function stop() {
    if (animation) {
      animation.cancel()
    }
  }

  function getPositions() {
    return positions
  }

  return {
    animate,
    play,
    stop,
    getPositions,
  }
}

export default createSpring

/*
usage:

const spring = spring(100, 1, 0.8)
spring.animate(0, 0, document.querySelector(".box"), () => {
  console.log("animation end")
})
spring.play()
*/