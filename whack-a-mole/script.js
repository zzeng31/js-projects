const GameConfig = {
  SNAKE_TIME: 2,
  GAME_TIME: 10,
  GOPHER_NUMBER: 3,
};

const Model = (() => {
  class Game {
    #score;
    #state;
    #onChange;
    #time;

    constructor() {
      this.#state = [];
      this.#score = 0;
      this.#time = GameConfig.GAME_TIME;
      for (let i = 0; i < 12; i++) {
        this.#state.push({
          id: i,
          status: null,
        });
      }
    }
    reset() {
      this.#state = [];
      this.#score = 0;
      this.#time = GameConfig.GAME_TIME;
      for (let i = 0; i < 12; i++) {
        this.#state.push({
          id: i,
          status: null,
        });
      }
    }
    get score() {
      return this.#score;
    }
    get time() {
      return this.#time;
    }
    set time(time) {
      this.#time = time;
      this.#onChange?.();
    }
    get state() {
      return this.#state;
    }
    set score(newScore) {
      this.#score = newScore;
      this.#onChange?.();
    }
    set state(newState) {
      this.#state = newState;
      this.#onChange?.();
    }
    subscribe(callback) {
      this.#onChange = callback;
    }
  }
  return {
    Game,
  };
})();
const View = (() => {
  const scoreEl = document.querySelector(".game-score");
  const boardEl = document.querySelector(".game-board");
  const timeEl = document.querySelector(".time-left");
  const holeEls = document.querySelectorAll(".game-block");
  const startBtn = document.querySelector(".game-start-btn");
  const renderHoles = (state) => {
    if (state.length > 0) {
      state.forEach((hole) => {
        if (hole.status !== null)
          holeEls[hole.id].innerHTML = `<img class='mole' src='./${
            hole.status === "gopher" ? "gopher" : "snake"
          }.jpeg' id=${hole.id}>`;
      });
    }
  };
  const clearGame = () => {
    holeEls.forEach((hole) => {
      hole.innerHTML = "";
    });
    scoreEl.innerHTML = 0;
    timeEl.innerHTML = 0;
  };
  const clearHole = (id) => {
    holeEls[id].innerHTML = "";
  };
  const renderScore = (score) => {
    scoreEl.innerHTML = score;
  };
  const renderTime = (time) => {
    timeEl.innerHTML = time;
  };
  const renderGameOver = () => {
    alert("Game is over");
  };
  const renderAllSnake = () => {
    holeEls.forEach(
      (hole) =>
        (hole.innerHTML = `<img class='mole' src='./snake.jpeg' id=${hole.id}>`)
    );
  };

  return {
    startBtn,
    holeEls,
    boardEl,
    renderHoles,
    clearGame,
    clearHole,
    renderScore,
    renderTime,
    renderGameOver,
    renderAllSnake,
  };
})();
const Controller = ((view, model) => {
  const game = new model.Game();
  let snakeInterval;
  let interval;
  let gameTimeout;
  const init = () => {
    const numberGophers = GameConfig.GOPHER_NUMBER;
    const newState = game.state;
    for (let i = 0; i < numberGophers; i++) {
      let id = generateRandom(12);
      while (newState[id].status !== null) {
        id = generateRandom(12);
      }
      newState[id].status = "gopher";
    }
    game.state = newState;

    // console.log(game.state);
  };
  const startGame = () => {
    console.log("game start!");
    stopTimer();
    init();
    setTimer();
  };
  const resetGame = () => {
    view.clearGame();
    game.reset();
    view.renderHoles(game.state);
    view.renderScore(0);
    view.renderTime(0);
  };
  const handleBtn = () => {
    view.startBtn.addEventListener("click", () => {
      resetGame();
      startGame();
    });
  };
  const handleWhack = () => {
    view.boardEl.addEventListener("click", (event) => {
      const newState = game.state;
      if (event.target.className === "mole") {
        if (game.state[+event.target.id].status === "snake") {
          view.renderAllSnake();
          stopTimer();
          setTimeout(() => {
            view.renderGameOver();
          }, 500);
        } else {
          game.state.forEach((hole) => {
            if (hole.id === +event.target.id) {
              newState[hole.id].status = null;
              view.clearHole(hole.id);
              regenerateGopher(hole.id);
              game.state = newState;
              addScore();
            }
          });
        }
      }
    });
  };
  const generateRandom = (range) => {
    return Math.floor(Math.random() * range);
  };
  const generateSnake = () => {
    let randomId = generateRandom(12);
    const newState = game.state;
    newState.forEach((hole) => {
      if (hole.status === "snake") {
        hole.status = null;
        view.clearHole(hole.id);
      }
    });
    while (
      game.state[randomId].status !== null &&
      game.state[randomId].status !== "snake"
    ) {
      randomId = generateRandom(12);
    }

    newState[randomId].status = "snake";
    game.state = newState;
  };

  const regenerateGopher = (id) => {
    let randomId = generateRandom(12);
    console.log(randomId);
    while (randomId === id || game.state[randomId].status !== null) {
      randomId = generateRandom(12);
    }
    const newState = game.state;
    newState[randomId].status = "gopher";
  };
  const addScore = () => {
    let newScore = game.score;
    game.score = ++newScore;
  };

  const setTimer = () => {
    let time = game.time;
    interval = setInterval(() => {
      game.time = time;
      time--;
    }, 1000);
    snakeInterval = setInterval(() => {
      generateSnake();
    }, GameConfig.SNAKE_TIME * 1000);
    gameTimeout = setTimeout(() => {
      stopTimer();
      view.renderGameOver();
    }, (time + 1) * 1000);
  };
  const stopTimer = () => {
    console.log("timer reset");
    clearInterval(interval);
    clearInterval(snakeInterval);
    clearTimeout(gameTimeout);
  };

  const bootstrap = () => {
    handleBtn();
    handleWhack();
    console.log(game.state);
    game.subscribe(() => {
      view.renderHoles(game.state);
      view.renderScore(game.score);
      view.renderTime(game.time);
    });
  };
  return {
    bootstrap,
  };
})(View, Model);
Controller.bootstrap();
