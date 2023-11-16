const types = [
  "Hearts",
  "Clubs",
  "Spades",
  "Diamond"
];

const suite = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King"
];

let cardDrawSnd = new Audio("../assets/media/flipcard-91468.mp3")
const deck = [];

for (let i = 0; i < types.length; i++) {
  for (let j = 0; j < suite.length; j++) {
    deck.push(types[i] + "-" + suite[j]);
  }
}

function randomValue (a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function random (a, b) {
  return Math.random() * b < a;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

let gameDeck = [...deck]
let playerHand = []
let dealerHand = []
let dealerReady = false

let h
let s
let d

let pl
let de

function disableControls() {
  h = gsap.set(hitB, {
    backgroundColor:"rgba(255, 255, 255, 0.3)",
    border:"0.3rem solid rgba(255, 255, 255, 0.3)",
    pointerEvents:"none",
  });

  s = gsap.set(standB, {
    backgroundColor:"rgba(255, 255, 255, 0.3)",
    border:"0.3rem solid rgba(255, 255, 255, 0.3)",
    pointerEvents:"none",
  });

  d = gsap.set(doubleB, {
    backgroundColor:"rgba(255, 255, 255, 0.3)",
    border:"0.3rem solid rgba(255, 255, 255, 0.3)",
    pointerEvents:"none",
  });

  document.getElementById("hitB").disabled = true
  document.getElementById("standB").disabled = true
  document.getElementById("doubleB").disabled = true
}

function enableControls() {
  h.revert()
  s.revert()
  d.revert()

  document.getElementById("hitB").disabled = false
  document.getElementById("standB").disabled = false
  document.getElementById("doubleB").disabled = false
}

async function dealCards() {
  disableControls()
  await delay(1000)
  hit(false)
  await delay(1000)
  hit(false)
  await delay(1000)
  await enableControls()
}

async function hit(disable = true) {
  if (disable) {disableControls()}
  const roll = randomValue(0, gameDeck.length - 1)
  playerHand.push(gameDeck[roll])
  cardDrawSnd.play()
  document.getElementById("playercards").innerHTML += `<img draggable="false" src="../assets/media/cards/${gameDeck[roll]}.png">`
  gameDeck[roll] = ""
  gameDeck = gameDeck.filter(e => String(e).trim());

  let pCount = cardCounter(playerHand)

  document.getElementById("playercount").innerHTML = pCount

  if (pCount <= 21) {
    let toPercentage = Math.floor((pCount / 21) * 60)

    gsap.set(playercount, {
      backgroundImage: `linear-gradient(to bottom, white ${80 - toPercentage}%, black 0%)`,
    });
  } else {
    gsap.set(playercount, {
      color:"red",
    });

    if (disable) {
      await enableControls()
    }

    stand()
    return;
  }

  if (disable) {
    await delay(1000)
    await enableControls()
  }
}

async function double() {
  disableControls()
  hit(false)
  await delay(1000)
  stand()
}

function cardCounter (currentHand) {
  const countObj = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Jack: 10,
    Queen: 10,
    King: 10
  };

  let count = 0;
  for (let i = 0; i < currentHand.length; i++) {
    for (let j = 0; j < Object.keys(countObj).length; j++) {
      if (currentHand[i].includes(Object.keys(countObj)[j])) {
        count += Object.values(countObj)[j];
      }
    }
  }

  for (let i = 0; i < currentHand.length; i++) {
    if (currentHand[i].includes("Ace")) {
      if (count + 11 <= 21) {
        count += 11;
      } else {
        count += 1;
      }
    }
  }

  return count;
}

function dealerHit(start = false) {
  const dealerRoll = randomValue(0, gameDeck.length - 1)
  dealerHand.push(gameDeck[dealerRoll])
  cardDrawSnd.play()
  document.getElementById("dealercards").innerHTML += `<img draggable="false" src="../assets/media/cards/card_back.png">`
  gameDeck[dealerRoll] = ""
  gameDeck = gameDeck.filter(e => String(e).trim());

  if (!start) {dealer()}
}

async function dealerStart() {
  await delay(randomValue(3500, 5000))
  dealerHit(true)
  await delay(randomValue(1000, 1500))
  dealerHit(true)
  dealer()
}

async function dealer() {
  let dCount = cardCounter(dealerHand)
  await delay(randomValue(500, 3000))

  if (dCount <= 21 && dCount >= 18) {
    dealerReady = true;
  } else if (dCount < 18 && dCount > 13) {
    if (random((21 - dCount), 12)) {
      dealerHit();
    } else {
      dealerReady = true;
    }
  } else if (dCount <= 13) {
    dealerHit();
  } else {
    dealerReady = true;
  }
}

async function stand() {
  disableControls()

  while (!dealerReady) {
    await delay(1000);
  }

  let pCount = cardCounter(playerHand)
  let dCount = cardCounter(dealerHand)

  document.getElementById("dealercards").innerHTML = "<p class=\"count\" id=\"dealercount\"></p>"
  cardDrawSnd.play()

  for (let i = 0; i < dealerHand.length; i++) {
    document.getElementById("dealercards").innerHTML += `<img draggable="false" src="../assets/media/cards/${dealerHand[i]}.png">`
  }

  await window.onload
  document.getElementById("dealercount").innerHTML = dCount

  if (dCount <= 21) {
    let toPercentage = Math.floor((dCount / 21) * 60)

    gsap.set(dealercount, {
      backgroundImage: `linear-gradient(to bottom, white ${80 - toPercentage}%, black 0%)`,
    });
  } else {
    gsap.set(dealercount, {
      color:"red",
    });
  }

  if (pCount > 21 && dCount > 21) {
    pl = gsap.to(playerBox, {
      duration:2,
      backgroundColor: "rgba(255,150,0,0.2)",
      border: "0.3rem solid rgba(255,150,0,0.5)",
    });
    de = gsap.to(dealerBox, {
      duration:2,
      backgroundColor: "rgba(255,150,0,0.2)",
      border: "0.3rem solid rgba(255,150,0,0.5)",
    });
  } else if (pCount <= 21 && dCount > 21) {
    pl = gsap.to(playerBox, {
      duration:2,
      backgroundColor: "rgba(0,255,0,0.2)",
      border: "0.3rem solid rgba(0,255,0,0.5)",
    });
    de = gsap.to(dealerBox, {
      duration:2,
      backgroundColor: "rgba(255,0,0,0.2)",
      border: "0.3rem solid rgba(255,0,0,0.5)",
    });
  } else if (pCount > 21 && dCount <= 21) {
    pl = gsap.to(playerBox, {
      duration:2,
      backgroundColor: "rgba(255,0,0,0.2)",
      border: "0.3rem solid rgba(255,0,0,0.5)",
    });
    de = gsap.to(dealerBox, {
      duration:2,
      backgroundColor: "rgba(0,255,0,0.2)",
      border: "0.3rem solid rgba(0,255,0,0.5)",
    });
  } else if (pCount === dCount) {
    pl = gsap.to(playerBox, {
      duration:2,
      backgroundColor: "rgba(255,150,0,0.2)",
      border: "0.3rem solid rgba(255,150,0,0.5)",
    });
    de = gsap.set(dealerBox, {
      duration:2,
      backgroundColor: "rgba(255,150,0,0.2)",
      border: "0.3rem solid rgba(255,150,0,0.5)",
    });
  } else {
    if (pCount > dCount) {
      pl = gsap.to(playerBox, {
        duration:2,
        backgroundColor: "rgba(0,255,0,0.2)",
        border: "0.3rem solid rgba(0,255,0,0.5)",
      });
      de = gsap.to(dealerBox, {
        duration:2,
        backgroundColor: "rgba(255,0,0,0.2)",
        border: "0.3rem solid rgba(255,0,0,0.5)",
      });
    } else {
      pl = gsap.to(playerBox, {
        duration: 2,
        backgroundColor: "rgba(255,0,0,0.2)",
        border: "0.3rem solid rgba(255,0,0,0.5)",
      });
      de = gsap.to(dealerBox, {
        duration: 2,
        backgroundColor: "rgba(0,255,0,0.2)",
        border: "0.3rem solid rgba(0,255,0,0.5)",
      });
    }
  }

  await delay(5000)
  pl.revert()
  de.revert()

  gameDeck = [...deck]
  playerHand = []
  dealerHand = []
  dealerReady = false

  document.getElementById("dealercards").innerHTML = "<p class=\"count\" id=\"dealercount\"></p>"
  document.getElementById("playercards").innerHTML = "<p class=\"count\" id=\"playercount\"></p>"

  await enableControls()

  dealCards()
  dealerStart()
}

dealerStart()
dealCards()