const weatherApi = {
  key: "4eb3703790b356562054106543b748b2",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather"
};

const inputBox = document.getElementById("input-box");

inputBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeatherReport(inputBox.value);
  }
});

function getWeatherReport(city) {
  if (!city.trim()) {
    swal("Error", "Please enter a city name", "error");
    return;
  }

  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(response => response.json())
    .then(showWeatherReport)
    .catch(() => {
      swal("Error", "Unable to fetch weather data", "error");
    });
}

function showWeatherReport(weather) {
  if (weather.cod === 404) {
    swal("Invalid City", "City not found", "warning");
    reset();
    return;
  }

  const weatherBody = document.getElementById("weather-body");
  const parent = document.getElementById("parent");
  weatherBody.style.display = "block";

  const today = new Date();

  weatherBody.innerHTML = `
    <div class="location-details">
      ${weather.name}, ${weather.sys.country}
      <div>${formatDate(today)}</div>
    </div>

    <div class="temp">${Math.round(weather.main.temp)}&deg;C</div>

    <div class="weather">
      ${weather.weather[0].main}
      <i class="${getIcon(weather.weather[0].main)}"></i>
    </div>

    <div class="min-max">
      ${Math.floor(weather.main.temp_min)}&deg;C (min) /
      ${Math.ceil(weather.main.temp_max)}&deg;C (max)
    </div>

    <div class="day-details">
      Feels like ${weather.main.feels_like}&deg;C |
      Humidity ${weather.main.humidity}% |
      Wind ${weather.wind.speed} km/h
    </div>
  `;

  parent.append(weatherBody);
  changeBackground(weather.weather[0].main);
  reset();
}

function formatDate(date) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return `${date.getDate()} ${months[date.getMonth()]} (${days[date.getDay()]})`;
}

function changeBackground(status) {
  const map = {
    Clouds: "clouds.jpg",
    Rain: "rainy.jpg",
    Clear: "clear.jpg",
    Snow: "snow.jpg",
    Sunny: "sunny.jpg",
    Thunderstorm: "thunderstrom.jpg",
    Drizzle: "drizzle.jpg",
    Mist: "mist.jpg",
    Haze: "mist.jpg",
    Fog: "mist.jpg"
  };

  document.body.style.backgroundImage =
    map[status] ? `url(img/${map[status]})` : "url(img/bg.jpg)";
}

function getIcon(status) {
  const icons = {
    Rain: "fas fa-cloud-showers-heavy",
    Clouds: "fas fa-cloud",
    Clear: "fas fa-sun",
    Snow: "fas fa-snowman",
    Thunderstorm: "fas fa-bolt",
    Drizzle: "fas fa-cloud-rain",
    Mist: "fas fa-smog"
  };
  return icons[status] || "fas fa-cloud";
}

function reset() {
  inputBox.value = "";
}
