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

let controls
let bets
let betReady = false

function disableControls() {
  h = gsap.set(hitB, {
    backgroundColor:"rgba(255, 255, 255, 0.3)",
    pointerEvents:"none",
  });

  s = gsap.set(standB, {
    backgroundColor:"rgba(255, 255, 255, 0.3)",
    pointerEvents:"none",
  });

  d = gsap.set(doubleB, {
    backgroundColor:"rgba(255, 255, 255, 0.3)",
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

async function hit(disable = true, double = false) {
  if (disable && !double) {disableControls()}
  const roll = randomValue(0, gameDeck.length - 1)
  playerHand.push(gameDeck[roll])
  cardDrawSnd.play()
  document.getElementById("playercards").innerHTML += `<img alt="card" draggable="false" src="../assets/media/cards/${gameDeck[roll]}.png">`
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

    if (!double) {
      enableControls()
      stand()
      return;
    }
  }

  if (disable && !double) {
    await delay(1000)
    await enableControls()
  }
}

async function double() {
  disableControls()
  hit(false, true)
  await delay(1000)
  enableControls()
  stand(true)
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
  document.getElementById("dealercards").innerHTML += `<img alt="card" draggable="false" src="../assets/media/cards/card_back.png">`
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
  await delay(randomValue(1000, 2000))

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

let win

async function stand(double = false) {
  disableControls()

  while (!dealerReady) {
    await delay(1000);
  }

  let pCount = cardCounter(playerHand)
  let dCount = cardCounter(dealerHand)

  document.getElementById("dealercards").innerHTML = "<p class=\"count\" id=\"dealercount\"></p>"

  for (let i = 0; i < dealerHand.length; i++) {
    document.getElementById("dealercards").innerHTML += `<img alt="card" draggable="false" src="../assets/media/cards/${dealerHand[i]}.png">`
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
    win = 0.5
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
    win = 1
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
    win = 0
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
    win = 0.5
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
      win = 1
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
      win = 0
    }
  }

  let delayNr = 5000

  if (!double) {
    if (win === 1) {
      moneyLogic(document.querySelector("#betmoney").value * 2)
    } else if (win === 0.5) {
      moneyLogic(document.querySelector("#betmoney").value)
    }
  } else {
    if (win === 1) {
      moneyLogic(document.querySelector("#betmoney").value * 3)
    } else if (win === 0.5) {
      moneyLogic(document.querySelector("#betmoney").value)
    } else if (win === 0) {
      await moneyLogic(-1 * document.querySelector("#betmoney").value)
      delayNr = 1000
    }
  }

  await delay(delayNr)
  pl.revert()
  de.revert()

  gameDeck = [...deck]
  playerHand = []
  dealerHand = []
  dealerReady = false

  document.getElementById("dealercards").innerHTML = ""
  document.getElementById("playercards").innerHTML = "<p class=\"count\" id=\"playercount\"></p>"

  await enableControls()

  betReady = false
  placeBet()
}

async function betButton () {
  betReady = true
}

async function placeBet() {
  disableControls()

  gsap.to(playercontrols, {
    delay:1,
    ease: "power1.out",
    duration: 3,
    y:500,
  });

  gsap.set(betcontrols, {
    y:500,
  });

  gsap.to(betcontrols, {
    delay:1,
    ease: "power1.out",
    duration: 3,
    y:0,
  });

  while (betReady !== true) {
    await delay(0.25)
  }

  moneyLogic(-1 * document.querySelector("#betmoney").value)

  gsap.to(betcontrols, {
    ease: "power1.out",
    duration: 3,
    y:500,
  });

  await gsap.to(playercontrols, {
    delay:1,
    ease: "power1.out",
    duration: 3,
    y:0,
  });

  await enableControls()

  play()
}

function play() {
  dealerStart()
  dealCards()
}

let balance = document.getElementById("balance").innerHTML.replace(",", "")
let moneyCalc = document.getElementById("moneycalc").innerHTML.replace(",", "")
balance = parseInt(balance.replace("$", ""))
moneyCalc = parseInt(moneyCalc.replace("$", ""))

let moneyCalcActive = false;

async function moneyLogic(value = 0) {

  while (moneyCalcActive) {
    await delay(250)
  }

  moneyCalcActive = true
  let fitter

  if (Math.abs(value) <= 2000) {
    fitter = 10
  } else if (Math.abs(value) <= 10000) {
    fitter = 100
  } else if (Math.abs(value) <= 50000) {
    fitter = 250
  } else {
    fitter = 500
  }

  let fit = Math.abs(value / fitter)
  let unit = fitter

  if (value < 0) {
    unit = -unit

    gsap.set(moneycalc, {
      color:"red",
    });
  } else {
    gsap.set(moneycalc, {
      color:"green",
    });
  }

  gsap.set(moneycalc, {
    x:-300,
  });

  document.getElementById("moneycalc").innerHTML = ttCash(value)
  moneyCalc = value

  await gsap.to(moneycalc, {
    duration:2,
    ease: "expoScale(0.5,7,none)",
    x:0,
  });

  await delay(1000)

  for (let i = 0; i < fit; i++) {
    await delay(1)
    moneyCalc -= unit
    balance += unit
    document.getElementById("moneycalc").innerHTML = ttCash(moneyCalc)
    document.getElementById("balance").innerHTML = ttCash(balance)
  }

  await delay(1000)

  await gsap.to(moneycalc, {
    duration:2,
    x:-300,
  });

  moneyCalcActive = false
}

function ttCash(number) {
  let formattedNumber = new Intl.NumberFormat().format(number);
  let moneyString = `$${formattedNumber}`;
  return moneyString.replaceAll("$-", "-$");
}

placeBet()