gsap.set("nav", {
  y: -80,
});

gsap.set("nav a", {
  x: 5800,
});

gsap.set(".owner", {
  x: -230,
});

gsap.to("nav", {
  duration: 2,
  delay: 1,
  y: 0,
});

gsap.to(".owner", {
  duration: 2,
  delay: 4.5,
  x: 0,
});

gsap.to("nav a", {
  duration: 3,
  ease:"none",
  stagger: 0.2,
  x: 0,
});