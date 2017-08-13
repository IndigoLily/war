Array.prototype.last = function () {
  return this[this.length - 1];
}

let $ = x => document.querySelector(x);
Node.prototype.$ = function(x) {
  return this.querySelector(x);
}

function card(rank = 2, suit = 0) {
  // ace is 14;
  // suits go from 0 to 3, in this order: spades, hearts, diamonds, clubs
  this.rank = rank;
  this.suit = suit;

  this.toString = function () {
    // convert to unicode card character and return that
    var output = '0x1F0';

    switch (this.suit) {
      case 0:
        output += 'A';
        break;
      case 1:
        output += 'B';
        break;
      case 2:
        output += 'C';
        break;
      case 3:
        output += 'D';
        break;
      default:
        return '?';
    }

    if (rank === 14) {
      output += 1;
    } else if (rank >= 12) {
      output += (this.rank+1).toString(16);
    } else {
      output += this.rank.toString(16);
    }

    return String.fromCodePoint(output);
  }
  this.toHTML = function() {
    var colour = (this.suit === 1 || this.suit === 2) ? 'red' : 'black';
    return `<span class='${colour} card'>${this.toString()}</span>`;
  }
}

function compare(card1, card2) {
  if (card1.rank === card2.rank) {
    return 0;
  } else if (card1.rank > card2.rank) {
    return 1;
  } else {
    return 2;
  }
}

var deck = [];
var hand1 = [];
var hand2 = [];

const player1 = $('#player1');
const player2 = $('#player2');
const win = $('#win');
const button = $('#reset');

var speed = 1;

function deal() {
  var toggle = true;
  while (deck.length) {
    if (toggle) {
      hand1.push(deck.splice((Math.floor(Math.random() * deck.length)), 1)[0]);
    } else {
      hand2.push(deck.splice((Math.floor(Math.random() * deck.length)), 1)[0]);
    }
    toggle = !toggle;
  }
  player1.innerText = hand1.length;
  player2.innerText = hand2.length;

}

function reset() {
  console.clear();
  deck = [];
  hand1 = [];
  hand2 = [];
  for (let suit = 0; suit <= 3; suit++) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push(new card(rank, suit));
    }
  }
  win.innerText = '';
  button.disabled = true;
  $('#turns').innerHTML = '';
  deal();
}

function over() {
  return hand1.length > 0 && hand2.length > 0;
}

function war(level = 0) {
  var pool = [hand1.pop(), hand2.pop()];
  var winner = compare(...pool);

  if (level && winner) console.log(`Level ${level} war`);

  var turn;
  var turnstring = `${pool[0].toHTML()} ${['=','>','<'][winner]} ${pool[1].toHTML()} → `;
  if (!level) {
    var newturn = document.createElement('p');
    turn = $('#turns');
    turn.insertBefore(newturn, turn.$('p'));
    let result = '<span class=\'result\'></span>';
    newturn.innerHTML = turnstring + result;
  } else {
    turn = $('#turns p');
    turn.innerHTML += turnstring;
    turn.append(turn.$('.result'));
  }

  if (!winner) {
    for (let i = 0; i < 3 && over(); i++) {
      pool.push(hand1.pop());
      pool.push(hand2.pop());
    }
    winner = over() ? war(level + 1) : (hand1.length > 0) ? 1 : 2;
  }

  if (turn.$('.result').innerText === '') turn.$('.result').innerText = `Player ${winner} gets: `;
  pool.forEach(x => turn.$('.result').innerHTML += x.toHTML());

  while(pool.length) {
    let pick = (Math.random() * pool.length) | 0;
    let card = pool.splice( pick, 1 )[0];

    if (winner === 1 || !hand2.length) {
      hand1.unshift( card );
    } else if (winner === 2 || !hand1.length) {
      hand2.unshift( card );
    }
  }

  if (level) {
    return winner;
  } else {
    player1.innerText = hand1.length;
    player2.innerText = hand2.length;
    if ( over() ) {
      setTimeout(war, 2000/speed);
    } else {
      // game is over
      var winstr = `Player ${hand1.length > 0 ? 1 : 2} wins!`
      win.innerText = winstr;
      button.disabled = false;
      console.log(winstr);
      return;
    }
  }
}

button.onclick = function() {
  reset();
  war();
}

reset();
war();
