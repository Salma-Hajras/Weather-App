document.addEventListener("DOMContentLoaded", () => {

  /* Navbar Active Link */
  const navLinks = document.querySelectorAll('.nav-links li a');
  const currentPage = location.pathname.split("/").pop();

  navLinks.forEach(link => {
    if (
      link.getAttribute('href') === currentPage ||
      (currentPage === '' && link.getAttribute('href') === 'index.html')
    ) {
      link.classList.add('active');
    }
  });


  /* Hamburger Menu */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
});
  }
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});


  /* Weather Section */
  const searchBtn = document.getElementById("searchBtn");
  const cityInput = document.getElementById("cityInput");
  const weatherResult = document.getElementById("weatherResult");
  const celsiusBtn = document.getElementById("celsiusBtn");
  const fahrenheitBtn = document.getElementById("fahrenheitBtn");

  const API_KEY = "38cab1006296f95d1843bce6ef12c91c";

  let currentCity = "";
  let currentUnit = "metric";

  function displayWeather(data) {
    const { name, main, weather, wind } = data;

    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';

    weatherResult.innerHTML = `
      <div class="weather-card">
        <h3>${name}</h3>
        <p><strong>Temperature:</strong> ${main.temp}${unitSymbol}</p>
        <p><strong>Condition:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} ${windUnit}</p>
      </div>
    `;
  }

  async function getWeather(city) {
    try {
      weatherResult.innerHTML = "<p>Loading...</p>";

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${currentUnit}`
      );

      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      displayWeather(data);

    } catch (error) {
      weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
  }

  if (searchBtn && cityInput && weatherResult) {

    searchBtn.addEventListener("click", () => {
      const city = cityInput.value.trim();
      if (city) {
        currentCity = city;
        getWeather(city);
      }
    });

    cityInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
          currentCity = city;
          getWeather(city);
        }
      }
    });
  }


  /* Celsius / Fahrenheit Toggle */
  if (celsiusBtn && fahrenheitBtn) {

    celsiusBtn.addEventListener("click", () => {
      if (currentUnit !== "metric" && currentCity) {
        currentUnit = "metric";
        getWeather(currentCity);

        celsiusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      }
    });

    fahrenheitBtn.addEventListener("click", () => {
      if (currentUnit !== "imperial" && currentCity) {
        currentUnit = "imperial";
        getWeather(currentCity);

        fahrenheitBtn.classList.add("active");
        celsiusBtn.classList.remove("active");
      }
    });
  }


  /* Dark / Light Theme Toggle */
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i");

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      themeIcon.classList.replace("fa-moon", "fa-sun");
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");

      // Change icon
      if (isDark) {
        themeIcon.classList.replace("fa-moon", "fa-sun");
      } else {
        themeIcon.classList.replace("fa-sun", "fa-moon");
      }
    });
  }

});
