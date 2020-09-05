export async function ParseLocation(location) {
  let response;
  try {
    response = await fetch(
      `https://api.locationiq.com/v1/autocomplete.php?key=37af076ab6193a&q=${location}&format=json`
    );
    response = await response.json();

    if (response.error) {
      errorReport("Location not found !");
    }
    debugger;
  } catch (error) {
    console.error("Error, ", error);
  }
  // console.log(response[0]);
  return await {
    latitude: response[0].lat,
    longitude: response[0].lon,
    location: response[0].address.name,
    state: response[0].address.state,
    country: response[0].address.country,
  };
}

export function currentDate() {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let d = new Date();
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

export function addForecast(dailyForecast) {
  let forecastSection = document.querySelector(".forecast-section");
  const forecastDiv = [];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let d = new Date();

  forecastSection.innerHTML = "";

  for (let i = 1; i < dailyForecast.length - 1; i++) {
    let forecastDay = d.getDay();
    if (d.getDay() === 6) {
      forecastDay = -1;
    }

    forecastDiv[i] = document.createElement("div");
    forecastDiv[i].classList.add("forecast");

    let sunnyCondition = ["clear", "sun"];
    let cloudCondition = ["clouds"];
    let rainCondition = ["rain", "drizzle"];

    let weatherIcon = sunnyCondition.some((str) =>
      dailyForecast[i].weather[0].description.toLowerCase().includes(str)
    )
      ? "./svg/sun.svg"
      : rainCondition.some((str) =>
          dailyForecast[i].weather[0].description.toLowerCase().includes(str)
        )
      ? "./svg/rain.svg"
      : "./svg/cloud.svg";

    forecastDiv[i].innerHTML = `
      <div >
        <div>
          <div>
            <img src=${weatherIcon} alt="rain" />

            <span>${dailyForecast[i].weather[0].description}</span>
          </div>

          <span class="vr"></span>

          <span class="weather-degree">${Math.round(
            dailyForecast[i].temp.day
          )}&deg;C </span>
        </div>

        <h3>${days[forecastDay + i]}</h3>
      </div>
      `;
  }

  forecastDiv.forEach((div) => {
    forecastSection.appendChild(div);
  });
}

export function errorReport(error) {
  let currentLocation = document.querySelector(".current-location");
      let notFound = document.createElement("div");
      notFound.classList.add("valid-location-error");
      notFound.innerHTML = error;
      currentLocation.innerHTML = "";
      document.querySelector(".forecast-section").innerHTML = "";
      currentLocation.appendChild(notFound);
}

export function url(lat, lon) {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&%20exclude=minutely,hourly&units=metric&appid=9bcd3d9f9f02d99878e8189061742670`;
}
