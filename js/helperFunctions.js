export function setInnerHTML(selector, content) {
  document.querySelector(selector).innerHTML = content;
}

export function url(location) {
  return `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=9bcd3d9f9f02d99878e8189061742670`;
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

export function getCountryName(shortCode) {
  
}