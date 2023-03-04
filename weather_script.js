const BASE_URL = "https://api.openweathermap.org/geo/1.0/direct?q=";
const API_KEY = "24a8ab1b971bfeb47ba40b91f97d93f7";
const weather_state = ["cloud.png", "sun.png", "haze.png"];
const weatherImg = document.getElementById("weatherImg");
weatherImg.style.display = "none";
async function getWeatherData(cityName) {
  const cityUrl = `${BASE_URL}${cityName}&limit=1&appid=${API_KEY}`;
  const cityResponse = await fetch(cityUrl);
  const cityData = await cityResponse.json();
  const city = cityData[0];
  console.log(city);

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`;
  const weatherResponse = await fetch(weatherUrl);
  const weatherData = await weatherResponse.json();

  const weather = {
    city: city.name,
    weatherState: weatherData.weather[0].main,
    temp: Math.round(weatherData.main.temp - 273.15),
    tempMin: Math.round(weatherData.main.temp_min - 273.15),
    tempMax: Math.round(weatherData.main.temp_max - 273.15),
  };

  return weather;
}

function displayWeather(weather) {
  // const audio = new Audio("pop-click.wav");
  // audio.play();
  const cityElement = document.getElementById("city");
  const weatherStateElement = document.getElementById("weather-state");
  const tempElement = document.getElementById("temp");
  const tempMinElement = document.getElementById("temp-min");
  const tempMaxElement = document.getElementById("temp-max");

  cityElement.textContent = weather.city;
  weatherStateElement.textContent = weather.weatherState;
  tempElement.textContent = `${weather.temp} °C`;
  tempMinElement.textContent = ` ${weather.tempMin} °C`;
  tempMaxElement.textContent = ` ${weather.tempMax} °C`;
  console.log(weather.weatherState, typeof weather.weatherState);
  weatherImg.setAttribute(
    "src",
    weather.weatherState === "Haze"
      ? weather_state[2]
      : weather.weatherState === "Clouds"
      ? weather_state[0]
      : weather_state[1]
  );
  weatherImg.style.display = "block";
}

const inp = document.querySelector("#submit-form");
inp.addEventListener("click", async function (event) {
  event.preventDefault();
  const input = document.getElementById("city-input");
  const cityName = input.value;
  const weatherData = await getWeatherData(cityName);
  console.log(weatherData);
  displayWeather(weatherData);
});
