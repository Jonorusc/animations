import Spring from "../spring.class.js";

const app = document.querySelector("#app");
const spring = new Spring(600, 1, 7);

let mouseX,
  mouseY,
  dragDx = 0,
  dragDy = 0,
  animating = false;

app.addEventListener("mousedown", (e) => {
  if (animating) {
    spring.stop();
  }

  mouseX = e.clientX;
  mouseY = e.clientY;

  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
});

function mousemove(e) {
  const dx = e.clientX - mouseX;
  const dy = e.clientY - mouseY;
  dragDx = dragDx + dx;
  dragDy = dragDy + dy;
  mouseX = e.clientX;
  mouseY = e.clientY;

  app.style.transform = `translate(${dragDx}px, ${dragDy}px)`;
}

function mouseup(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dragDx = 0;
  dragDy = 0;

  spring.animate(dragDx, dragDy, app, () => {
    animating = false;
  });

  spring.play();
  animating = true;

  window.removeEventListener("mousemove", mousemove);
  window.removeEventListener("mouseup", mouseup);
}
