
const API_KEY = '6db68b2249005e33a8cf6d260bb1fffa'; 
const API_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}&q=`;


const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');

let currentTempInCelsius = 0;


document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    getWeatherData('Amravati'); 
    
    // Event listeners
    searchBtn.addEventListener('click', searchWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    celsiusBtn.addEventListener('click', () => toggleTempUnit('celsius'));
    fahrenheitBtn.addEventListener('click', () => toggleTempUnit('fahrenheit'));
});

async function getWeatherData(city) {
    try {
        showLoading(true);
        const response = await fetch(API_URL + city);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}\nPlease check the city name and try again.`);
    } finally {
        showLoading(false);
    }
}

function displayWeatherData(data) {
    console.log('Weather data:', data); 
    
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentTempInCelsius = data.main.temp;
    updateTemperatureDisplay();
    
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
}

function updateTemperatureDisplay() {
    if (celsiusBtn.classList.contains('active')) {
        temperature.textContent = Math.round(currentTempInCelsius);
    } else {
        temperature.textContent = Math.round((currentTempInCelsius * 9/5) + 32);
    }
}

function toggleTempUnit(unit) {
    if (unit === 'celsius' && !celsiusBtn.classList.contains('active')) {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
        updateTemperatureDisplay();
    } else if (unit === 'fahrenheit' && !fahrenheitBtn.classList.contains('active')) {
        fahrenheitBtn.classList.add('active');
        celsiusBtn.classList.remove('active');
        updateTemperatureDisplay();
    }
}

function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
}

function updateDate() {
    const now = new Date();
    dateElement.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showLoading(loading) {
    if (loading) {
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        searchBtn.disabled = true;
    } else {
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.disabled = false;
    }
}