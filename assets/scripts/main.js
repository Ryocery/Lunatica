gsap.set("nav", {
  y: -80,
});

gsap.set("nav a", {
  x: 5800,
});

gsap.set(".owner", {
  x: -230,
});

gsap.set(".loginbox", {
  y: 3230,
});

gsap.to("nav", {
  duration: 1,
  delay: 0.5,
  y: 0,
});

gsap.to(".owner", {
  duration: 2,
  delay: 2.5,
  x: 0,
});

gsap.to("nav a", {
  duration: 1.5,
  ease:"none",
  stagger: 0.2,
  x: 0,
});

gsap.to(".loginbox", {
  delay: 2,
  ease: "elastic.out(0.2,0.3)",
  duration: 1,
  y:0,
});