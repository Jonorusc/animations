const body = document.querySelector("body")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.style.width = "100%"
canvas.style.height = "100%"
let width = (canvas.width = window.innerWidth - 40)
let height = (canvas.height = window.innerHeight - 40)

// ranges
const springConstantRange = document.getElementById("springConstant")
const dampingRange = document.getElementById("damping")
const massRange = document.getElementById("mass")
const gravityRange = document.getElementById("gravity")

let physics = {
  springConstant: 0.04,
  damping: 0.1,
  gravity: 0.5,
  mass: 10, // ball weight
}

let ballRadius = Math.sqrt(physics.mass) * 12

{
  for (let rangeElement of [springConstantRange, dampingRange, massRange, gravityRange]) {
    showResult(rangeElement)
  }

  function showResult(rangeElement) {
    const resultElement = rangeElement.parentElement.querySelector(".result")
    resultElement.innerText = rangeElement.value
    rangeElement.addEventListener("input", () => {
      resultElement.innerText = rangeElement.value
      // update physics
      physics = {
        ...physics,
        [rangeElement.id]: Number(rangeElement.value),
      }
      ballRadius = Math.sqrt(physics.mass) * 12 // Adjust the factor as desired
    })
  }

  // resize canvas
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth - 40
    canvas.height = window.innerHeight - 40
    width = canvas.width
    height = canvas.height
  })
}

let spring = {
  x: width / 2,
  y: height / 4,
}

let ball = {
  x: width / 2,
  y: height / 2,
  vx: 0,
  vy: 0,
  isDragging: false,
  isResting: true,
}

let animationId

function update() {
  const dx = ball.x - spring.x
  const dy = ball.y - spring.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (ball.isResting) {
    // Apply spring force to the ball
    const springForceX = (spring.x - ball.x) * physics.springConstant
    const springForceY = (spring.y - ball.y) * physics.springConstant
    const accelerationX = springForceX - ball.vx * physics.damping
    // const accelerationY = springForceY - ball.vy * physics.damping + physics.gravity * physics.mass
    const accelerationY = (springForceY - ball.vy * physics.damping) / physics.mass + physics.gravity

    ball.vx += accelerationX
    ball.vy += accelerationY
    ball.x += ball.vx
    ball.y += ball.vy
  }

  // clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw spring
  const nx = dx / distance
  const ny = dy / distance

  ctx.beginPath()
  ctx.strokeStyle = "black"
  ctx.lineWidth = 2

  const step = 0.1
  const coilWidth = 10

  for (let i = step; i < 1 - step; i += step) {
    for (let j = 0; j < 1; j += 0.1) {
      const progress = i + j * step
      const xx = spring.x + dx * progress
      const yy = spring.y + dy * progress
      const sinValue = Math.sin(j * Math.PI * 2)
      const offsetX = sinValue * ny * coilWidth
      const offsetY = sinValue * nx * coilWidth
      ctx.lineTo(xx - offsetX, yy + offsetY)
    }
  }

  ctx.stroke()

  // Draw ball
  ctx.beginPath()

  const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ballRadius)
  gradient.addColorStop(0, "#090979")
  gradient.addColorStop(1, "#020024")

  ctx.fillStyle = gradient

  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2)
  ctx.fill()

  // run animation
  animationId = requestAnimationFrame(update)
}

// Mouse event handlers
canvas.addEventListener("mousedown", startDragging)

function startDragging(e) {
  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const dx = ball.x - mouseX
  const dy = ball.y - mouseY
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < ballRadius) {
    ball.isDragging = true
    ball.isResting = false
    canvas.addEventListener("mousemove", drag)
    canvas.addEventListener("mouseup", release)
  }
}

function drag(e) {
  if (ball.isDragging) {
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    ball.x = mouseX
    ball.y = mouseY
    body.style.cursor = "grabbing"
  } else {
    body.style.cursor = "grab"
  }
}

function release() {
  ball.isDragging = false
  ball.isResting = true
  body.style.cursor = "grab"
  cancelAnimationFrame(animationId)
  update()
  canvas.removeEventListener("mousemove", drag)
  canvas.removeEventListener("mouseup", release)
}

// Start the animation
update()
