const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const apiKey = "243e0637b1711769996d3439fc0ef015";
const addedCityNames = new Set(); // Set to track added city names

function sortCitiesByTemperature() {
  const cityElements = Array.from(list.querySelectorAll(".city"));
  cityElements.sort((a, b) => {
    const aTemp = parseFloat(a.querySelector(".city-temp").textContent);
    const bTemp = parseFloat(b.querySelector(".city-temp").textContent);
    return aTemp - bTemp; 
  });
  list.innerHTML = ""; 
  cityElements.forEach(cityElement => {
    list.appendChild(cityElement);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  if (addedCityNames.has(inputVal.toLowerCase())) {
    msg.textContent = "City already added.";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`;

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <div class="city-container">
          <div class="city-temps">
            <div class="city-temp">
              ${Math.round(main.temp)}<span>°C</span>
            </div>
            <div class="city-temp-maxmin">
              <span>H: ${Math.round(main.temp_max)}<sup>°C</sup></span>
              L: ${Math.round(main.temp_min)}<span>°C</span>
            </div>
            <div class="city-name" data-name="${name}">
              <span>${name}</span>
            </div>
          </div>
          <div class="city-temps">
            <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
            <figcaption>${weather[0]["description"]}</figcaption>
          </div>
        </div>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
      
      addedCityNames.add(inputVal.toLowerCase()); // Add the city name to the set

      sortCitiesByTemperature();
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});
