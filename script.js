let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    api_key = 'd12412cb16a55e0fb1e52e97e428a101',
    currentWeatherCard = document.querySelector('.current-weather'), 
    aqiCard = document.querySelector('.highlights .card'),
    humdityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windSpeedVal = document.getElementById('windSpeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

let sunriseCard = document.querySelector('.highlights .card:nth-of-type(2)');
console.log(sunriseCard); // Should log the element or null
let fiveDaysForecastCard = document.querySelector('.day-forecast');
console.log(fiveDaysForecastCard); // Check if this logs an element or null


function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Fetch air pollution data
    fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class="fa-regular fa-wind fa-3x"></i>
                    <div class="item">
                        <p>PM2.5</p>
                        <h2>${pm2_5}</h2>
                    </div>
                    <div class="item">
                        <p>PM10</p>
                        <h2>${pm10}</h2>
                    </div>
                    <div class="item">
                        <p>SO2</p>
                        <h2>${so2}</h2>
                    </div>
                    <div class="item">
                        <p>CO</p>
                        <h2>${co}</h2>
                    </div>
                    <div class="item">
                        <p>NO</p>
                        <h2>${no}</h2>
                    </div>
                    <div class="item">
                        <p>NO2</p>
                        <h2>${no2}</h2>
                    </div>
                    <div class="item">
                        <p>NH3</p>
                        <h2>${nh3}</h2>
                    </div>
                    <div class="item">
                        <p>O3</p>
                        <h2>${o3}</h2>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching air pollution data:', error);
            alert('Failed to fetch air pollution data');
        });

    // Fetch current weather
    fetch(WEATHER_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch weather data');
            return res.json();
        })
        .then(data => {


            console.log(data);

            const date = new Date();
            const { sunrise, sunset, timezone, visibility } = data.sys;
            const { humidity, pressure, feels_like } = data.main;
            const { speed } = data.wind;

            let sRiseTime = moment.utc(sunrise, 'x').add(timezone, 'seconds').format('hh:mm A');
            let sSetTime = moment.utc(sunset, 'x').add(timezone, 'seconds').format('hh:mm A');

            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
                        </div>
                    </div>
                    <hr>
                    <div class="card-footer">
                        <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                        <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
                    </div>
                </div>
            `;

            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon">
                            <i class="fa-light fa-sunrise fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunrise</p>
                            <h2>${sRiseTime}</h2>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <i class="fa-light fa-sunset fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunset</p>
                            <h2>${sSetTime}</h2>
                        </div>
                    </div>
                </div>
            `;

            humdityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure} hPa`;
            visibilityVal.innerHTML = `${visibility / 1000} km`;
            windSpeedVal.innerHTML = `${speed} m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Failed to fetch current weather');
        });

    // Fetch 5-day weather forecast
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';

            for (let i = 0; i < 8; i++) {
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if (hr < 12) a = 'AM';
                if (hr === 0) hr = 12;
                if (hr > 12) hr -= 12;

                hourlyForecastCard.innerHTML += `
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp).toFixed(2)}&deg;C</p>
                    </div>
                `;
            }

            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDaysForecastCard.innerHTML = '';
            for (let i = 0; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="">
                            <span>${(fiveDaysForecast[i].main.temp).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Failed to fetch weather forecast');
        });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';  // Clear the input field
    if (!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    fetch(GEOCODING_API_URL)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch city coordinates');
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                alert(`City ${cityName} not found.`);
                return;
            }
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state); // Fetch current weather and 5-day forecast
        })
        .catch(error => {
            console.error('Error fetching city coordinates:', error);
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(position => {
        let { latitude, longitude } = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL)
            .then(res => res.json())
            .then(data => {
                let { name, country, state } = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            })
            .catch(() => {
                alert('Failed to fetch user coordinates');
            });
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation permission denied');
        } else {
            alert('Failed to get user location');
        }
    });
}

// Add click event listener for the search button
searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        getCityCoordinates();
    }
});
