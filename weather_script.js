const BASE_URL = "https://api.openweathermap.org/geo/1.0/direct?q=";
const API_KEY = "24a8ab1b971bfeb47ba40b91f97d93f7";
const API_WeatherCondition = "http://openweathermap.org/img/wn/";
const weatherImg = document.getElementById("weatherImg");
weatherImg.style.display = "none";
const getLocalTime = document.querySelector("#LocalTime");

function timezoneOffsetToTime(offsetSeconds) {
  var date = new Date();
  var localTime = date.getTime();
  var localOffset = date.getTimezoneOffset() * 60000;
  var utcTime = localTime + localOffset;
  var newTime = utcTime + offsetSeconds * 1000;
  return newTime;
}

async function getWeatherData(cityName) {
  try {
    const cityUrl = `${BASE_URL}${cityName}&limit=1&appid=${API_KEY}`;
    const cityResponse = await fetch(cityUrl);
    const cityData = await cityResponse.json();
    const city = cityData[0];

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const weather = {
      city: city.name,
      weatherState: weatherData.weather[0].main,
      temp: Math.round(weatherData.main.temp - 273.15),
      tempMin: Math.round(weatherData.main.temp_min - 273.15),
      tempMax: Math.round(weatherData.main.temp_max - 273.15),
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
      humidity: weatherData.main.humidity,

      timezone: weatherData.timezone,
      dt: weatherData.dt,
      description: weatherData.weather[0].description,
      id: weatherData.weather[0].id,
    };

    return weather;
  } catch {
    return "";
  }
}

newTime = "";
result = "";
getLocalTime.innerHTML = "Local Time: ";
setInterval(() => {
  if (typeof newTime === "number") {
    newTime += 1000;
    var currentTimeString = new Date(newTime).toLocaleTimeString();
    result = currentTimeString;
    getLocalTime.innerHTML = `Local Time: ${result}`;
  } else {
    getLocalTime.innerHTML = "Local Time: ";
    console.log("There is still not local time");
  }
}, 1000);

const weather_description = (description, id) => {
  function rain_code(id) {
    if (500 <= id <= 504) {
      return "10d";
    } else if (id === 511) {
      return "13d";
    } else {
      return "09d";
    }
  }
  let wn_code = null;

  if (description.split(" ").includes("thunderstorm")) {
    wn_code = "11d";
  } else if (description.split(" ").includes("drizzle")) {
    wn_code = "09d";
  } else if (description.split(" ").includes("clear")) {
    var hour = new Date(newTime).getHours();
    wn_code = hour >= 6 && hour < 18 ? "01d" : "01n";
  } else if (description.split(" ").includes("snow")) {
    wn_code = "13d";
  } else if (description.split(" ").includes("rain")) {
    wn_code = rain_code(description, id);
  } else if (description.split(" ").includes("clouds")) {
    var hour = new Date(newTime).getHours();
    wn_code = id === 801 ? (hour >= 6 && hour < 18 ? "02d" : "02n") : "04d";
  } else {
    wn_code = atmosphere_code(description);
  }
  return API_WeatherCondition + wn_code + "@2x.png";
};

function displayWeather(weather) {
  newTime = timezoneOffsetToTime(weather.timezone);
  const audio = new Audio("pop-click.wav");
  audio.play();
  const cityElement = document.getElementById("city");
  const weatherStateElement = document.getElementById("weather-state");
  const tempElement = document.getElementById("temp");
  const tempMinElement = document.getElementById("temp-min");
  const tempMaxElement = document.getElementById("temp-max");
  const humidityElement = document.getElementById("humidity-value");
  const sunriseElement = document.getElementById("sunrise-value");
  const sunsetElement = document.getElementById("sunset-value");

  cityElement.textContent = weather.city;
  weatherStateElement.textContent = weather.description;
  tempElement.textContent = `${weather.temp} °C`;
  tempMinElement.textContent = ` ${weather.tempMin} °C`;
  tempMaxElement.textContent = ` ${weather.tempMax} °C`;
  humidityElement.textContent = `${weather.humidity}%`;
  sunriseElement.textContent = `${new Date(
    timezoneOffsetToTime(weather.sunrise)
  ).toLocaleTimeString()}`;
  sunsetElement.textContent = `${new Date(
    timezoneOffsetToTime(weather.sunset)
  ).toLocaleTimeString()}`;

  weatherImg.setAttribute(
    "src",
    weather_description(weather.description, weather.id)
  );
  weatherImg.style.display = "block";
}

const inp = document.querySelector("#submit-form");
inp.addEventListener("click", async function (event) {
  event.preventDefault();
  const input = document.getElementById("city-input");
  const cityName = input.value;
  await getWeatherData(cityName).then((data) => {
    try {
      displayWeather(data);
    } catch {
      alert("there's no city");
      return;
    }
  });
});
