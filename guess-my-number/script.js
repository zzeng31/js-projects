"use strict";

const game = {
  //game object
  score: 20, //state variables
  highestScore: 0,
  correctNumber: Math.trunc(Math.random() * 20) + 1,
  logic: function (number) {
    if (number === this.correctNumber) {
      // correct guess
      if (this.highestScore < this.score) {
        //update highestScore
        this.highestScore = this.score;
      }
      setMessage("🎉Correct Number!");
      document.querySelector(".highscore").textContent = this.highestScore; //update dom highScore
      document.querySelector(".number").textContent = this.correctNumber; //displat correct number
      document.querySelector(".check").disabled = true; //disable button
      document.querySelector("body").style.backgroundColor = "#60b347"; //set background color to green
      document.querySelector(".number").style.width = "20rem"; //set width of number box
    } else {
      // incorrect guess
      number > this.correctNumber
        ? setMessage("❌Too High")
        : setMessage("❌Too Low");
      this.score--;
      if (this.score === 0) {
        setMessage("😭You Lost");
        document.querySelector(".number").textContent = this.correctNumber; //display correct number
        document.querySelector("body").style.backgroundColor = "red"; //set background color to red
        document.querySelector(".check").disabled = true; //disable button
      }
    }
    document.querySelector(".score").textContent = this.score; // update score
  },
  reset: function () {
    this.score = 20; //reset score
    this.correctNumber = Math.floor(Math.random() * 20) + 1; // reset correctNumber var
    console.log(game.correctNumber);
  },
};

console.log(game.correctNumber);
const setMessage = function (message) {
  document.querySelector(".message").textContent = message;
};
const inputHandler = function () {
  if (!document.querySelector(".guess").value) {
    //handle if input is empty
    setMessage("Type in a number!");
    return;
  }

  const number = Number(document.querySelector(".guess").value); //accept input number
  game.logic(number);
};
const againHandler = function () {
  document.querySelector(".check").disabled = false; //reset button
  document.querySelector(".guess").value = ""; //reset input field
  document.querySelector(".score").textContent = 20; //reset page score
  setMessage("Start guessing..."); //reset message
  document.querySelector(".number").textContent = "?"; //reset number display
  document.querySelector("body").style.backgroundColor = "#222"; //reset background color
  document.querySelector(".number").style.width = "15rem"; //reset width of number box
  game.reset(); //reset game object
};
document.querySelector(".check").addEventListener("click", inputHandler);
document.querySelector(".again").addEventListener("click", againHandler);
