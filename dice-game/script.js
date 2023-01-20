'use strict';
//selecting elements
const score0Elm = document.getElementById('score--0');
const score1Elm = document.getElementById('score--1');
const current0Elm = document.getElementById('current--0');
const current1Elm = document.getElementById('current--1');
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const diceEl = document.querySelector('.dice');
const game = {
  state: {
    player1Score: 0,
    player1Current: 0,
    player2Score: 0,
    player2Current: 0,
    dice: 0,
    currentPlayer: 1,
  },
  roll: function () {
    //roll dice
    return Math.trunc(Math.random() * 6 + 1);
  },
  rollLogic: function () {
    //roll dice logic
    console.log(`current player:${this.state.currentPlayer}`);
    this.dice = this.roll();

    console.log(`dice:${this.dice}`);
    diceEl.src = `dice-${this.dice}.png`; //change the dice picture
    if (this.dice !== 1) {
      //if dice not 1
      if (this.state.currentPlayer === 1) {
        this.state.player1Current += this.dice; //add dice score to player1 current score
      }
      if (this.state.currentPlayer === 2) {
        this.state.player2Current += this.dice; //add dice score to player2 current score
      }
      this.changeCurrent(); //change the current score dom
    } else {
      //if dice is 1
      this.emptyCurrent(); //empty the current score dom
      this.changePlayer(); //swap player
    }
  },
  holdLogic: function () {
    //hold score logic
    if (this.state.currentPlayer === 1) {
      this.state.player1Score += this.state.player1Current; //add current score to player1 score
      if (this.state.player1Score >= 20) {
        this.setWinner(0); //player 1 win
      }
    } else {
      this.state.player2Score += this.state.player2Current; //add current score to player2 score
      if (this.state.player2Score >= 20) {
        this.setWinner(1); //player 2 win
      }
    }
    this.changeScore(); //change the  score dom
    this.emptyCurrent(); //empty the current score dom
    this.changePlayer(); //swap player
  },
  setWinner: function (winner) {
    document
      .querySelector('.player--' + winner)
      .classList.add('player--winner');
    diceEl.classList.add('hidden'); //hide the dice when win
    this.disableButtons(true);
  },
  disableButtons: function (option) {
    document.querySelector('.btn--roll').disabled = option;
    document.querySelector('.btn--hold').disabled = option;
  },
  changePlayer: function () {
    //swap player
    player0.classList.toggle('player--active'); //note .classList.toggle can remove/add the class automatically.
    player1.classList.toggle('player--active');
    this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
  },
  changeCurrent: function () {
    //change the current score of current player
    if (this.state.currentPlayer === 1) {
      current0Elm.textContent = this.state.player1Current;
    } else {
      current1Elm.textContent = this.state.player2Current;
    }
  },
  changeScore: function () {
    //change the score of current player
    if (this.state.currentPlayer === 1)
      score0Elm.textContent = this.state.player1Score;
    else score1Elm.textContent = this.state.player2Score;
  },
  emptyCurrent: function () {
    if (this.state.currentPlayer === 1) {
      current0Elm.textContent = 0;
      this.state.player1Current = 0;
    } else {
      current1Elm.textContent = 0;
      this.state.player2Current = 0;
    }
  },
  reset: function () {
    this.state.player1Score = 0; //set states to default
    this.state.player1Current = 0;
    this.state.player2Score = 0;
    this.state.player2Current = 0;
    this.state.dice = this.roll();
    this.state.currentPlayer = 2; //empty player2 score
    this.emptyCurrent(); //empty player2 score
    this.changeScore(); //empty player2 score
    this.changePlayer(); //change and empty player1 score
    this.emptyCurrent(); //empty player1 score
    this.changeScore(); //empty player1 score
    player0.classList.remove('player--winner');
    player1.classList.remove('player--winner');
    this.disableButtons(false); //reset button
    diceEl.classList.remove('hidden'); //display dice
  },
};
document.querySelector('.btn--roll').addEventListener('click', function () {
  game.rollLogic();
});
document.querySelector('.btn--hold').addEventListener('click', function () {
  game.holdLogic();
});
document.querySelector('.btn--new').addEventListener('click', function () {
  game.reset();
});
