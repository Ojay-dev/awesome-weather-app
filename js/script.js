import { url, setInnerHTML, currentDate } from "./helperFunctions.js";
import countryIso from "./countryISO.js";

const weatherDetails = document.querySelector(".current-weather-details");
const notFoundErrorMsg = document.querySelector(".not-found");
const searchForm = document.querySelector("form");
const preloader = document.querySelector(".loader");
const weatherDom = document.querySelector("main");

let location;

window.addEventListener("load", () => {
  document.querySelector(
    ".current-weather-details h3"
  ).innerHTML = currentDate();

  const successfulLookup = async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      let response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d03c0184daa143daba2fc0b38cad9cd1`
      );
      location = await response.json();
      console.log(location.results[0].components.city);
      lookUpLocationWeather(location.results[0].components.city)
    } catch (error) {
      console.error("Error, ", error);
      weatherDetails.style.display = "none";
      notFoundErrorMsg.style.display = "block";
      notFoundErrorMsg.innerHTML = "Please enter your location"
    }
  };

  const errorLookup = (error) => {
    console.log(error);
    geoLocationErrorHandler();
  }

  window.navigator.geolocation.getCurrentPosition(
    successfulLookup,
    errorLookup
  );
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(document.querySelector("input[type='search']").value);
  let searchInput = document.querySelector("input[type='search']").value;

  lookUpLocationWeather(searchInput);
});

function geoLocationErrorHandler() {
  preloader.style.display = "none";
  weatherDetails.style.display = "none";
  notFoundErrorMsg.style.display = "block";
  notFoundErrorMsg.innerHTML = "Please enter your location";
}

async function lookUpLocationWeather(location) {
  try {
    let response = await fetch(url(location));

    console.log(response);

    preloader.style.display = "block";
    weatherDom.style.display = "none";

    if (weatherDetails.style.display === "none") {
      weatherDetails.style.display = "block";
      notFoundErrorMsg.style.display = "none";
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
      setTimeout(() => {
        setInnerHTML(".weather-degree>span", Math.round(response.main.temp));
        setInnerHTML(
          ".current-weather-details>h4",
          `${response.name}, ${countryIso[response.sys.country]}`
        );

        setInnerHTML("#weather-description", response.weather[0].description);

        let sunnyCondition = ["clear", "sun"];
        let cloudCondition = ["clouds"];
        let rainCondition = ["rain", "drizzle"];

        if (
          sunnyCondition.some((str) =>
            response.weather[0].description.toLowerCase().includes(str)
          )
        ) {
          document
            .querySelector(".current-weather-details img")
            .setAttribute("src", "./svg/sun.svg");
        } else if (
          rainCondition.some((str) =>
            response.weather[0].description.toLowerCase().includes(str)
          )
        ) {
          document
            .querySelector(".current-weather-details img")
            .setAttribute("src", "./svg/rain.svg");
        } else {
          document
            .querySelector(".current-weather-details img")
            .setAttribute("src", "./svg/cloud.svg");
        }
        preloader.style.display = "none";
        weatherDom.style.display = "block";
      }, 1000);

      console.log(response);
    }
  } catch (error) {
    console.log(error.message);
    geoLocationErrorHandler()
  }
}
