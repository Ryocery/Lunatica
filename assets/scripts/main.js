// Main Logic //

let selectedGame
let selectedHover

function disableMainSelect() {
  let games = document.getElementsByClassName("game")
  for (let i = 0; i < games.length; i++) {
    games[i].onclick = null;
  }
}

function enableMainSelect() {
  let games = document.getElementsByClassName("game")

  selectedGame.revert()
  selectedHover.revert()

  for (let i = 0; i < games.length; i++) {
    games[i].onclick = function () { mainSelect(document.getElementById(games[i].id)); };
  }
}

async function mainSelect(item) {
  selectedGame = gsap.to(item, {
    duration:0,
    backgroundColor:"white",
    color:"black",
  });

  selectedHover = gsap.set(".game:hover img", {
    filter: "brightness(0)",
  });

  disableMainSelect()
  await delay(3000)
  window.location.replace("./games/" + item.id + ".html")
}

// Extra

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}