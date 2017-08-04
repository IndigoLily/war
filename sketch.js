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
}

function reset() {
    deck = [];
    for (let suit = 0; suit <= 3; suit++) {
        for (let rank = 2; rank <= 14; rank++) {
            deck.push(new card(rank, suit));
        }
    }
    deal();
}

reset();

function war(level = 0) {
    var pool = [hand1.pop(), hand2.pop()];
    var winner = compare(...pool);

    if (!winner) {
        if ( hand1.length <= 6 || hand2.length <= 6 ) {
            debugger;
            var lower = hand1.length > hand2.length ? hand2 : hand1;
            for (let i = 0; i < lower.length; i++) {
                pool.push(lower.pop());
            }
        } else {
            for (let i = 0; i < 3; i++) {
                pool.push(hand1.pop());
                pool.push(hand2.pop());
            }
            winner = war(level + 1);
        }
    }

    if (winner === 1 || !hand2.length) {
        hand1.unshift(...pool);
    } else if (winner === 2 || !hand1.length) {
        hand2.unshift(...pool);
    }

    if (level) {
        console.log(`Level ${level} war`)
        return winner;
    } else {
        document.getElementById('player1').innerText = `Player 1 has ${hand1.length} cards`;
        document.getElementById('player2').innerText = `Player 2 has ${hand2.length} cards`;
        if (hand1.length > 0 && hand2.length > 0) {
            setTimeout(war, 1000/60);
        } else {
            // game is over
            // document.getElementById('player1').style.display = 'none';
            // document.getElementById('player2').style.display = 'none';
            var winstr = `Player ${hand1.length > 0 ? 1 : 2} wins!`
            document.getElementById('win').innerText = winstr;
            console.log(winstr);
            return;
        }
    }
}

war();