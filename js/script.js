import { url, setInnerHTML, currentDate } from "./helperFunctions.js";
import countryIso from "./countryISO.js"

(function () {
  const searchForm = document.querySelector("form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(document.querySelector("input[type='search']").value);
    let searchInput = document.querySelector("input[type='search']").value;

    (async function () {
      try {
        let response = await fetch(url(searchInput));
        if (response.status === 200) {
          response = await response.json();
          setInnerHTML(".weather-degree>span", Math.round(response.main.temp));
          setInnerHTML(
            ".current-weather-details>h4",
            `${response.name}, ${countryIso[response.sys.country]}`
          );

          setInnerHTML("#weather-description", response.weather[0].description)

          let sunnyCondition = ["clear", "sun"];
          let cloudCondition = ["clouds"];
          let rainCondition = ["rain"];

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

          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  });

  setInnerHTML(".current-weather-details>h3", currentDate());
})();
