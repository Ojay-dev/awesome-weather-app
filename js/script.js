import {
  ParseLocation,
  currentDate,
  addForecast,
} from "./helperFunctions.js";


const searchForm = document.querySelector("form");


window.addEventListener("load", () => {

  const successfulLookup = async (position) => {
    const { latitude, longitude } = position.coords;
    lookUpLocationWeather({ lat: latitude, lon: longitude });
  };

  const errorLookup = (error) => {
    geoLocationErrorHandler();
  };

  window.navigator.geolocation.getCurrentPosition(
    successfulLookup,
    errorLookup
  );
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("input[type='search']").value;

  lookUpLocationWeather(searchInput);
});

function geoLocationErrorHandler() {
  // weatherDetails.style.display = "none";
  // notFoundErrorMsg.style.display = "block";
  // notFoundErrorMsg.innerHTML = "Please enter a location";
}

function url(lat, lon) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&%20exclude=minutely,hourly&units=metric&appid=9bcd3d9f9f02d99878e8189061742670`;
}

async function lookUpLocationWeather(location) {
  try {
    let response;
    let locationData = {};

    if (typeof location === "object") {
      response = await fetch(url(location.lat, location.lon));
      let data = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=37af076ab6193a&format=json&lat=${location.lat}&lon=${location.lon}`
      );
      data = await data.json();
      console.log(data.address.state);
      locationData = {
        location: data.address.state,
        country: data.address.country,
      };
    } else {
      locationData = await ParseLocation(location);
      response = await fetch(url(locationData.latitude, locationData.latitude));
    }

    if (response.status === 404) {
      weatherDetails.style.display = "none";
      notFoundErrorMsg.style.display = "block";
    }

    if (!response.ok) {
      throw Error(response.statusText);
    }

    if (response.status === 200) {
      response = await response.json();
      console.log(response);

      let sunnyCondition = ["clear", "sun"];
      let cloudCondition = ["clouds"];
      let rainCondition = ["rain", "drizzle"];

      let weatherIcon = sunnyCondition.some((str) =>
        response.current.weather[0].description.toLowerCase().includes(str)
      )
        ? "./svg/sun.svg"
        : rainCondition.some((str) =>
            response.current.weather[0].description.toLowerCase().includes(str)
          )
        ? "./svg/rain.svg"
        : "./svg/cloud.svg";

      let currentLocation = document.querySelector(".current-location");
      let currentWeatherDetails = document.createElement("div");
      currentWeatherDetails.classList.add("current-weather-details");

      currentWeatherDetails.innerHTML = `
        <div>
          <div>
            <img src=${weatherIcon} alt="rain" />

            <span id="weather-description">rainy</span>
          </div>

          <span class="vr"></span>

          <span class="weather-degree"> ${Math.round(
            response.current.temp
          )}&deg;C </span>
        </div>

        <h3>${currentDate()}</h3>
        <h4>${locationData.location}, ${
        !locationData.state
          ? ""
          : locationData.location === locationData.state
          ? ""
          : locationData.state + ","
      }  ${locationData.country}
        </h4>
      `;

      currentLocation.innerHTML = "";
      currentLocation.appendChild(currentWeatherDetails);

      
      addForecast(response.daily);
    }
  } catch (error) {
    geoLocationErrorHandler();
  }
}
