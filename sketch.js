Array.prototype.last = function () {
    return this[this.length - 1];
}

function card(rank = 2, suit = 0) {
    // ace is 14;
    // suits go from 0 to 3, in this order: diamonds, clubs, hearts, spades
    this.rank = rank;
    this.suit = suit;

    this.toString = function () {
        // convert to unicode card character and return that

        // temporary
        var output = "";
        switch (this.rank) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                output += this.rank;
                break;
            case 10:
                output += "T";
                break;
            case 11:
                output += "J";
                break;
            case 12:
                output += "Q";
                break;
            case 13:
                output += "K";
                break;
            case 14:
                output += "A";
                break;
            default:
                output += "?";
                break;
        }
        switch (this.suit) {
            case 0:
                output += "♦";
                break;
            case 1:
                output += "♣";
                break;
            case 2:
                output += "♥";
                break;
            case 3:
                output += "♠";
                break;
            default:
                output += "?";
                break;
        }
        return output;
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

const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const win = document.getElementById('win');
const button = document.getElementById('reset');

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
    button.style.display = 'none';
    deal();
}

function h() {
    return hand1.length > 0 && hand2.length > 0;
}

function war( garbo = 0, level = 0) {
    var pool = [hand1.pop(), hand2.pop()];
    var winner = compare(...pool);

    if (!winner) {
        for (let i = 0; i < 3 && h(); i++) {
            pool.push(hand1.pop());
            pool.push(hand2.pop());
        }
        winner = h() ? war( 0, level + 1 ) : (hand1.length > 0) ? 1 : 2;
    }

    while(pool.length) {
        let pick = (Math.random() * pool.length) | 0;
        let card = pool.splice( pick, 1 )[0]

        if (winner === 1 || !hand2.length) {
            hand1.unshift( card );
        } else if (winner === 2 || !hand1.length) {
            hand2.unshift( card );
        }
    }

    if (level) {
        console.log(`Level ${level} war`)
        return winner;
    } else {
        player1.innerText = hand1.length;
        player2.innerText = hand2.length;
        if ( h() ) {
            requestAnimationFrame(war);
        } else {
            // game is over
            var winstr = `Player ${hand1.length > 0 ? 1 : 2} wins!`
            win.innerText = winstr;
            button.style.display = 'block';
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