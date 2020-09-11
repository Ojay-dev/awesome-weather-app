import {
  ParseLocation,
  currentDate,
  addForecast,
  errorReport,
  url,
} from "./helperFunctions.js";

const searchForm = document.querySelector("form");
let currentLocation = document.querySelector(".current-location");
const preloader = document.querySelector(".loader");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw.js")
      .then((swReg) => {
        console.log("Service Worker is registered", swReg);
      })
      .catch((err) => {
        console.error("Service Worker Error", err);
      });
  });
}

window.addEventListener("load", () => {
  preloader.setAttribute("style", "display:block;");
  const successfulLookup = async (position) => {
    const { latitude, longitude } = position.coords;
    lookUpLocationWeather({ lat: latitude, lon: longitude });
  };

  const errorLookup = (error) => {
    preloader.setAttribute("style", "display:none;");
    errorReport("Please enter a location");
  };

  window.navigator.geolocation.getCurrentPosition(
    successfulLookup,
    errorLookup
  );
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let searchInput = document.querySelector("input[type='search']").value;
  currentLocation.innerHTML = "";
  document.querySelector(".forecast-section").innerHTML = "";
  preloader.setAttribute("style", "display:block;");
  lookUpLocationWeather(searchInput);
});

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
      preloader.setAttribute("style", "display:none;");
      errorReport("Location not found!");
    }

    if (!response.ok) {
      throw Error(response.statusText);
    }

    if (response.status === 200) {
      response = await response.json();
      console.log(response);

      let sunnyCondition = ["clear", "sun"];
      let cloudCondition = ["clouds"];
      let rainCondition = ["rainy", "rain", "drizzle"];

      let weatherIcon = sunnyCondition.some((str) =>
        response.current.weather[0].description.toLowerCase().includes(str)
      )
        ? "./svg/sun.svg"
        : rainCondition.some((str) =>
            response.current.weather[0].description.toLowerCase().includes(str)
          )
        ? "./svg/rain.svg"
        : "./svg/cloud.svg";

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
      preloader.setAttribute("style", "display:none;");
      currentLocation.appendChild(currentWeatherDetails);
      addForecast(response.daily);
    }
  } catch (error) {
    preloader.setAttribute("style", "display:none;");
    errorReport("An error occured");
  }
}
