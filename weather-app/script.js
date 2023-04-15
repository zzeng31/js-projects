const APIs = (() => {
  const APIKey = "407e08d145bed0b6af57a26a7f5b69aa";
  const getWeather = (city) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
    ).then((res) => res.json());
  };
  return { getWeather };
})();
const Model = (() => {
  class Weather {
    #weather;
    #onChange;
    constructor() {
      this.#weather = {};
    }
    get weather() {
      return this.#weather;
    }
    set weather(newWeather) {
      this.#weather = newWeather;
      this.#onChange?.();
    }
    subscribe(callback) {
      this.#onChange = callback;
    }
  }
  const { getWeather } = APIs;
  return {
    Weather,
    getWeather,
  };
})();
const View = (() => {
  const weatherContainerEl = document.querySelector(".weather-app__container");
  const weatherBoxEl = document.querySelector(".weather-app__weather-box");
  const errorBoxEl = document.querySelector(".weather-app__not-found");
  const inputEl = document.querySelector(".weather-app__input");
  const searchBtn = document.querySelector(".search-icon");
  const weatherImgEl = document.querySelector(".weather-img");
  const degreeEl = document.querySelector(".degree");
  const weatherEl = document.querySelector(".weather");

  const humidtyEl = document.querySelector(".humidty");
  const windEl = document.querySelector(".wind");
  const errorTextEl = document.querySelector(".error-text");

  const renderWeather = (weather) => {
    console.log(weather);
    clearRender();
    setTimeout(() => {
      weatherContainerEl.classList.add("active");
      weatherBoxEl.style.display = "flex";
      weatherBoxEl.classList.add("fadeIn");
      switch (weather.weather[0].main) {
        case "Clouds":
          weatherImgEl.src = "./img/cloud.png";
          break;
        case "Clear":
          weatherImgEl.src = "./img/clear.png";
          break;
        case "Mist":
          weatherImgEl.src = "./img/mist.png";
          break;
        case "Rain":
          weatherImgEl.src = "./img/rain.png";
          break;
        case "Snow":
          weatherImgEl.src = "./img/snow.png";
          break;
        default:
          weatherImgEl.src = "./img/404.png";
          break;
      }
      degreeEl.innerHTML = weather.main.temp;
      weatherEl.innerHTML = weather.weather[0].description;
      humidtyEl.innerHTML = weather.main.humidity;
      windEl.innerHTML = weather.wind.speed;
    }, 500);
  };
  const render404 = (err) => {
    clearRender();
    setTimeout(() => {
      weatherContainerEl.classList.add("active");
      errorBoxEl.style.display = "flex";
      errorBoxEl.classList.add("fadeIn");
      errorTextEl.innerHTML = err.message;
    }, 500);
  };
  const clearRender = () => {
    weatherContainerEl.classList.remove("active");
    errorBoxEl.style.display = "none";
    weatherBoxEl.style.display = "none";
    weatherBoxEl.classList.remove("fadeIn");
    errorBoxEl.classList.remove("fadeIn");
  };

  return {
    renderWeather,
    render404,
    clearRender,
    inputEl,
    searchBtn,
  };
})();
const Controller = ((model, view) => {
  const weather = new model.Weather();

  const handleSubmit = () => {
    view.searchBtn.addEventListener("click", (event) => {
      const inputValue = view.inputEl.value;
      console.log(inputValue);
      if (inputValue.length === 0) {
        view.render404({ message: "Please enter a city" });
      } else {
        model
          .getWeather(inputValue)
          .then((data) => {
            if (+data.cod > 300) {
              throw data;
            } else {
              weather.weather = data;
            }
          })
          .catch((err) => {
            view.render404(err);
          });
      }
    });
  };
  const bootstrap = () => {
    handleSubmit();
    weather.subscribe(() => {
      view.renderWeather(weather.weather);
    });
  };
  return {
    bootstrap,
  };
})(Model, View);
Controller.bootstrap();
