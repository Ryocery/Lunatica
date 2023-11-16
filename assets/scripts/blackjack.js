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
