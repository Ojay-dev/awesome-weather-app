import {
  ParseLocation,
  setInnerHTML,
  currentDate,
  addForecast,
} from "./helperFunctions.js";
import countryIso from "./countryISO.js";

const weatherDetails = document.querySelector(".current-weather-details");
const notFoundErrorMsg = document.querySelector(".not-found");
const searchForm = document.querySelector("form");

let location;

window.addEventListener("load", () => {
  // document.querySelector(
  //   ".current-weather-details h3"
  // ).innerHTML = currentDate();

  const successfulLookup = async (position) => {
    const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude);
    lookUpLocationWeather({ lat: latitude, lon: longitude });

    // try {
    //   let response = await fetch(
    //     // `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d03c0184daa143daba2fc0b38cad9cd1`
    //     `https://us1.locationiq.com/v1/reverse.php?key=37af076ab6193a&format=json&lat=${latitude}&lon=${longitude}`
    //   );

    //   location = await response.json();
    //   // console.log(location)
    // } catch (error) {
    //   console.error("Error, ", error);
    //   weatherDetails.style.display = "none";
    //   notFoundErrorMsg.style.display = "block";
    //   notFoundErrorMsg.innerHTML = "Please enter a location";
    // }
  };

  const errorLookup = (error) => {
    // console.log(error);
    geoLocationErrorHandler();
  };

  window.navigator.geolocation.getCurrentPosition(
    successfulLookup,
    errorLookup
  );
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log(document.querySelector("input[type='search']").value);
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

    // if (weatherDetails.style.display === "none") {
    //   weatherDetails.style.display = "block";
    //   notFoundErrorMsg.style.display = "none";
    // }

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

      // setTimeout(() => {
      // setInnerHTML(".weather-degree>span", Math.round(response.current.temp));
      // setInnerHTML(
      //   ".current-weather-details>h4",
      //   `${locationData.location}, ${
      //     !locationData.state
      //       ? ""
      //       : locationData.location === locationData.state
      //       ? ""
      //       : locationData.state + ","
      //   }  ${locationData.country}`
      // );

      // setInnerHTML(
      //   "#weather-description",
      //   response.current.weather[0].description
      // );
      // document
      //   .querySelector(".current-weather-details img")
      //   .setAttribute("src", "./svg/sun.svg");

      // let sunnyCondition = ["clear", "sun"];
      // let cloudCondition = ["clouds"];
      // let rainCondition = ["rain", "drizzle"];

      // if (
      //   sunnyCondition.some((str) =>
      //     response.current.weather[0].description.toLowerCase().includes(str)
      //   )
      // ) {
      //   document
      //     .querySelector(".current-weather-details img")
      //     .setAttribute("src", "./svg/sun.svg");
      // } else if (
      //   rainCondition.some((str) =>
      //     response.current.weather[0].description.toLowerCase().includes(str)
      //   )
      // ) {
      //   document
      //     .querySelector(".current-weather-details img")
      //     .setAttribute("src", "./svg/rain.svg");
      // } else {
      //   document
      //     .querySelector(".current-weather-details img")
      //     .setAttribute("src", "./svg/cloud.svg");
      // }

      addForecast(response.daily);
      // }, 1000);

      // console.log(response);
    }
  } catch (error) {
    // console.log(error.message);
    geoLocationErrorHandler();
  }
}
