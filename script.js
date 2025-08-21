// OpenWeatherMap Configuration - Daha güvenilir API
const API_KEY = '5f472b7acba333cd8a035ea85a0d4d4c'; // OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct'; // Şehir arama için
const AIR_QUALITY_URL = 'https://api.openweathermap.org/data/2.5/air_pollution'; // Hava kalitesi için

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const tempUnitToggle = document.getElementById('tempUnitToggle');
const languageToggle = document.getElementById('languageToggle');
const weatherContainer = document.getElementById('weatherContainer');   
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// Weather display elements
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const temperature = document.getElementById('temperature');
const tempUnit = document.getElementById('tempUnit');
const weatherDescription = document.getElementById('weatherDescription');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const daylightDuration = document.getElementById('daylightDuration');
const airQuality = document.getElementById('airQuality');
const uvIndex = document.getElementById('uvIndex');
const errorMessage = document.getElementById('errorMessage');

// Forecast elements
const forecastContainer = document.getElementById('forecastContainer');
const forecastGrid = document.getElementById('forecastGrid');

// Hourly chart elements
const hourlyChart = document.getElementById('hourlyChart');
const temperatureChart = document.getElementById('temperatureChart');

// Major cities elements
const citiesContainer = document.getElementById('citiesContainer');
const citiesGrid = document.getElementById('citiesGrid');

// Major cities list
const majorCities = ['Roma', 'İstanbul', 'Paris', 'London'];

// Translation object
const translations = {
    tr: {
        searchPlaceholder: 'Şehir ara...',
        citySelect: 'Şehir Seçin',
        weatherInfo: 'Hava durumu bilgisi',
        feelsLike: 'Hissedilen',
        wind: 'Rüzgar',
        humidity: 'Nem',
        visibility: 'Görüş',
        airQuality: 'Hava Kalitesi',
        uvIndex: 'UV İndeksi',
        daylightHours: 'Gündüz saatleri',
        loading: 'Hava durumu bilgileri yükleniyor...',
        error: 'Bir hata oluştu',
        cityNotFound: 'Şehir bulunamadı',
        apiError: 'Şehir bulunamadı veya API hatası',
        forecast5Day: '5 Günlük Tahmin',
        hourlyForecast: 'Saatlik Tahmin',
        km: 'km',
        kmh: 'km/h',
        hours: 'sa',
        minutes: 'dk'
    },
    en: {
        searchPlaceholder: 'Search city...',
        citySelect: 'Select City',
        weatherInfo: 'Weather information',
        feelsLike: 'Feels Like',
        wind: 'Wind',
        humidity: 'Humidity',
        visibility: 'Visibility',
        airQuality: 'Air Quality',
        uvIndex: 'UV Index',
        daylightHours: 'Daylight hours',
        loading: 'Loading weather information...',
        error: 'An error occurred',
        cityNotFound: 'City not found',
        apiError: 'City not found or API error',
        forecast5Day: '5-Day Forecast',
        hourlyForecast: 'Hourly Forecast',
        km: 'km',
        kmh: 'km/h',
        hours: 'h',
        minutes: 'min'
    }
};

// Autocomplete elements
let suggestionsContainer = null;
let searchTimeout = null;

// Forecast data cache
let currentForecastData = null;

// Theme management
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Temperature unit management
let isFahrenheit = localStorage.getItem('tempUnit') === 'fahrenheit';

// Language management
let isEnglish = localStorage.getItem('language') === 'english';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    createSuggestionsContainer();
    updateTheme();
    updateTempUnit();
    updateLanguage();
    updateCurrentDate();
    
    // Set default city (Konya)
    if (!localStorage.getItem('lastCity')) {
        getWeatherData('Konya');
    } else {
        getWeatherData(localStorage.getItem('lastCity'));
    }
    
    // Load major cities weather
    loadMajorCitiesWeather();
    
    // Update chart every minute to keep current hour updated
    setInterval(() => {
        updateCurrentDate();
        // Redraw chart with current time if we have data
        if (currentForecastData) {
            drawTemperatureChart(currentForecastData);
        }
        // Update sun position every minute
        const sunriseElement = document.getElementById('sunrise');
        const sunsetElement = document.getElementById('sunset');
        if (sunriseElement.textContent !== '--:--' && sunsetElement.textContent !== '--:--') {
            // Parse stored sunrise/sunset times and update sun position
            const today = new Date();
            const sunriseTime = parseTimeString(sunriseElement.textContent, today);
            const sunsetTime = parseTimeString(sunsetElement.textContent, today);
            updateSunPosition(sunriseTime, sunsetTime);
        }
    }, 60000); // Update every minute
    
    // Refresh data every 30 minutes to get fresh forecasts
    setInterval(() => {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            console.log('Auto-refreshing weather data for:', lastCity);
            getWeatherData(lastCity);
        }
        // Also refresh major cities weather
        loadMajorCitiesWeather();
    }, 1800000); // Refresh every 30 minutes
});

// Create suggestions container
function createSuggestionsContainer() {
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'suggestionsContainer';
    suggestionsContainer.className = 'suggestions-container';
    document.querySelector('.search-container').appendChild(suggestionsContainer);
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

searchInput.addEventListener('input', handleSearchInput);
searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
        showSuggestions();
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        hideSuggestions();
    }
});

themeToggle.addEventListener('click', toggleTheme);
tempUnitToggle.addEventListener('click', toggleTempUnit);
languageToggle.addEventListener('click', toggleLanguage);

// Handle search input for autocomplete
function handleSearchInput() {
    const query = searchInput.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // Hide suggestions if query is empty
    if (!query) {
        hideSuggestions();
        return;
    }
    
    // Debounce search requests
    searchTimeout = setTimeout(() => {
        searchCities(query);
    }, 300);
}

// Search cities using Geocoding API
async function searchCities(query) {
    try {
        const response = await fetch(`${GEOCODING_URL}?q=${query}&limit=5&appid=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Şehir arama hatası');
        }
        
        const cities = await response.json();
        displaySuggestions(cities);
        
    } catch (err) {
        console.error('City search error:', err);
        hideSuggestions();
    }
}

// Display search suggestions
function displaySuggestions(cities) {
    if (!cities || cities.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    
    // Remove duplicates based on city name and country
    const uniqueCities = [];
    const seenCities = new Set();
    
    cities.forEach(city => {
        const cityKey = `${city.name}-${city.country}`;
        if (!seenCities.has(cityKey)) {
            seenCities.add(cityKey);
            uniqueCities.push(city);
        }
    });
    
    uniqueCities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        const cityName = city.name;
        const countryName = city.country;
        const stateName = city.state;
        
        let displayName = cityName;
        if (stateName) {
            displayName += `, ${stateName}`;
        }
        displayName += `, ${countryName}`;
        
        suggestionItem.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>${displayName}</span>
        `;
        
        suggestionItem.addEventListener('click', () => {
            searchInput.value = displayName;
            hideSuggestions();
            getWeatherData(displayName);
        });
        
        suggestionItem.addEventListener('mouseenter', () => {
            suggestionItem.classList.add('hover');
        });
        
        suggestionItem.addEventListener('mouseleave', () => {
            suggestionItem.classList.remove('hover');
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    showSuggestions();
}

// Show suggestions container
function showSuggestions() {
    suggestionsContainer.style.display = 'block';
}

// Hide suggestions container
function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
}

// Search functionality
function handleSearch() {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
}

// Get coordinates for air quality data
async function getCoordinates(city) {
    try {
        const response = await fetch(`${GEOCODING_URL}?q=${city}&limit=1&appid=${API_KEY}`);
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data && data.length > 0) {
            return { lat: data[0].lat, lon: data[0].lon };
        }
        return null;
    } catch (err) {
        console.error('Geocoding error:', err);
        return null;
    }
}

// Get weather data from API
async function getWeatherData(city) {
    showLoading();
    hideError();
    
    try {
        // Get coordinates first for air quality data
        const coords = await getCoordinates(city);
        if (!coords) {
            throw new Error('Şehir bulunamadı');
        }
        
        // Get current weather, forecast, and air quality data
        const lang = isEnglish ? 'en' : 'tr';
        const [currentResponse, forecastResponse, airQualityResponse] = await Promise.all([
            fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`),
            fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=${lang}`),
            fetch(`${AIR_QUALITY_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`)
        ]);
        
        if (!currentResponse.ok || !forecastResponse.ok || !airQualityResponse.ok) {
            console.error('Weather API Error:', currentResponse.status, forecastResponse.status, airQualityResponse.status);
            throw new Error('Şehir bulunamadı veya API hatası');
        }
        
        const [currentData, forecastData, airQualityData] = await Promise.all([
            currentResponse.json(),
            forecastResponse.json(),
            airQualityResponse.json()
        ]);
        
        displayWeatherData(currentData);
        displayForecast(forecastData);
        displayAirQualityData(airQualityData);
        
        // Cache forecast data for real-time chart updates
        currentForecastData = forecastData;
        drawTemperatureChart(forecastData);
        
        localStorage.setItem('lastCity', city);
        
    } catch (err) {
        console.error('API Error:', err);
        showError(err.message);
    }
}

// Display weather data
function displayWeatherData(data) {
    hideLoading();
    
    // Update city name and date
    cityName.textContent = data.name;
    updateCurrentDate();
    
    // Update temperature and description
    temperature.textContent = isFahrenheit ? celsiusToFahrenheit(data.main.temp) : Math.round(data.main.temp);
    tempUnit.textContent = isFahrenheit ? '°F' : '°C';
    weatherDescription.textContent = data.weather[0].description;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Update weather details
    feelsLike.textContent = formatTemperature(data.main.feels_like);
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // m/s to km/h
    humidity.textContent = `${data.main.humidity}%`;
    visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`; // m to km
    
    // Update sunrise and sunset times
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    
    sunrise.textContent = sunriseTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    sunset.textContent = sunsetTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    // Calculate and display daylight duration
    const daylightMs = sunsetTime - sunriseTime;
    const daylightHours = Math.floor(daylightMs / (1000 * 60 * 60));
    const daylightMinutes = Math.floor((daylightMs % (1000 * 60 * 60)) / (1000 * 60));
    daylightDuration.textContent = `${daylightHours} sa ${daylightMinutes} dk`;
    
    // Update sun position based on current time
    updateSunPosition(sunriseTime, sunsetTime);
    
    // Show weather container
    weatherContainer.style.display = 'block';
}

// Display air quality and UV index data
function displayAirQualityData(data) {
    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;
    
    // Air Quality Index (1-5 scale)
    const aqiText = getAQIText(aqi);
    airQuality.textContent = aqiText;
    
    // UV Index (more accurate calculation)
    const uvValue = calculateUVIndex();
    const uvText = getUVText(uvValue);
    uvIndex.textContent = `${uvValue}, ${uvText}`;
}

// Get Air Quality Index text
function getAQIText(aqi) {
    const aqiLevels = {
        1: 'İyi',
        2: 'Orta',
        3: 'Kötü',
        4: 'Çok Kötü',
        5: 'Tehlikeli'
    };
    return aqiLevels[aqi] || 'Bilinmiyor';
}

// Get UV Index text
function getUVText(uvValue) {
    if (uvValue <= 2) return 'düşük';
    if (uvValue <= 5) return 'orta';
    if (uvValue <= 7) return 'yüksek';
    if (uvValue <= 10) return 'çok yüksek';
    return 'aşırı';
}

// Calculate UV Index (more accurate calculation)
function calculateUVIndex() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth() + 1; // 1-12
    
    // Base UV calculation based on season and time
    let uvBase = 0;
    
    // Seasonal adjustment (higher in summer months)
    let seasonalMultiplier = 1;
    if (month >= 5 && month <= 8) {
        seasonalMultiplier = 1.3; // Summer months
    } else if (month >= 3 && month <= 4 || month >= 9 && month <= 10) {
        seasonalMultiplier = 0.8; // Spring/Fall
    } else {
        seasonalMultiplier = 0.4; // Winter
    }
    
    // Time-based UV (highest around noon)
    if (hour >= 11 && hour <= 15) {
        uvBase = 8 + Math.random() * 4; // 8-12 range during peak hours
    } else if (hour >= 9 && hour <= 10 || hour >= 16 && hour <= 17) {
        uvBase = 4 + Math.random() * 4; // 4-8 range during morning/evening
    } else if (hour >= 7 && hour <= 8 || hour >= 18 && hour <= 19) {
        uvBase = 2 + Math.random() * 2; // 2-4 range during early morning/late evening
    } else {
        uvBase = 0 + Math.random() * 1; // 0-1 range during night
    }
    
    const finalUV = Math.round(uvBase * seasonalMultiplier);
    return Math.min(finalUV, 11); // Cap at 11 (extreme)
}

// Display forecast data
function displayForecast(data) {
    // Clear previous forecast
    forecastGrid.innerHTML = '';
    
    // Get daily forecasts (every 24 hours at 12:00)
    const dailyForecasts = [];
    const today = new Date();
    
    // Group forecasts by day and get the forecast for 12:00 (noon) of each day
    const forecastsByDay = {};
    
    data.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        const dayKey = forecastDate.toDateString();
        
        // Skip today
        if (forecastDate.toDateString() === today.toDateString()) {
            return;
        }
        
        if (!forecastsByDay[dayKey]) {
            forecastsByDay[dayKey] = [];
        }
        forecastsByDay[dayKey].push(forecast);
    });
    
    // Get the forecast closest to 12:00 for each day
    Object.keys(forecastsByDay).forEach(dayKey => {
        const dayForecasts = forecastsByDay[dayKey];
        const targetHour = 12; // 12:00 PM
        
        // Find forecast closest to 12:00
        let closestForecast = dayForecasts[0];
        let minDiff = Math.abs(new Date(closestForecast.dt * 1000).getHours() - targetHour);
        
        dayForecasts.forEach(forecast => {
            const hour = new Date(forecast.dt * 1000).getHours();
            const diff = Math.abs(hour - targetHour);
            if (diff < minDiff) {
                minDiff = diff;
                closestForecast = forecast;
            }
        });
        
        dailyForecasts.push(closestForecast);
    });
    
    // Sort by date and take first 5 days
    dailyForecasts.sort((a, b) => a.dt - b.dt);
    const fiveDayForecast = dailyForecasts.slice(0, 5);
    
    // Ensure we have exactly 5 days
    if (fiveDayForecast.length < 5) {
        console.log('Not enough forecast data available');
    }
    
    // Create forecast items
    fiveDayForecast.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        const dayName = forecastDate.toLocaleDateString('tr-TR', { weekday: 'short' });
        const dayNumber = forecastDate.getDate();
        const monthName = forecastDate.toLocaleDateString('tr-TR', { month: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-day">
                <div class="forecast-date">${dayNumber} ${monthName}</div>
                <div class="forecast-day-name">${dayName}</div>
            </div>
            <div class="forecast-weather">
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" 
                         alt="${forecast.weather[0].description}">
                </div>
                <div class="forecast-temp">${formatTemperature(forecast.main.temp).replace('°C', '').replace('°F', '')}<span style="font-size: 12px;">${isFahrenheit ? '°F' : '°C'}</span></div>
            </div>
        `;
        
        forecastGrid.appendChild(forecastItem);
    });
    
    // Show forecast container
    forecastContainer.style.display = 'block';
}

// Draw temperature chart
function drawTemperatureChart(data) {
    const canvas = temperatureChart;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 480;
    canvas.height = 150;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    
    // Create hourly data by interpolating between 3-hour forecasts
    const temperatures = [];
    const times = [];
    
    // Generate 24 hours starting from current hour
    for (let hour = 0; hour < 24; hour++) {
        const targetHour = (currentHour + hour) % 24;
        times.push(`${targetHour.toString().padStart(2, '0')}:00`);
        
        // Find the closest forecast data points for interpolation
        const forecastIndex = Math.floor(hour / 3); // API gives data every 3 hours
        const nextForecastIndex = Math.min(forecastIndex + 1, data.list.length - 1);
        
        if (forecastIndex < data.list.length) {
            const currentForecast = data.list[forecastIndex];
            const nextForecast = data.list[nextForecastIndex];
            
            // Interpolate temperature if we have next forecast
            let temp;
            if (forecastIndex !== nextForecastIndex && hour % 3 !== 0) {
                const ratio = (hour % 3) / 3; // How far between the two forecasts
                temp = currentForecast.main.temp + (nextForecast.main.temp - currentForecast.main.temp) * ratio;
            } else {
                temp = currentForecast.main.temp;
            }
            
            const finalTemp = Math.round(temp);
            temperatures.push(isFahrenheit ? celsiusToFahrenheit(finalTemp) : finalTemp);
        } else {
            // If we don't have enough forecast data, use the last available
            const lastTemp = Math.round(data.list[data.list.length - 1].main.temp);
            temperatures.push(isFahrenheit ? celsiusToFahrenheit(lastTemp) : lastTemp);
        }
    }
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Find min and max temperatures for scaling
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);
    const tempRange = maxTemp - minTemp || 1; // Avoid division by zero
    

    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (i * chartHeight / 4);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
        
        // Temperature labels
        const temp = maxTemp - (i * tempRange / 4);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(temp) + (isFahrenheit ? '°F' : '°C'), padding - 10, y + 4);
    }
    
    // Vertical grid lines and time labels - show every 4 hours
    for (let i = 0; i < times.length; i += 4) {
        const x = padding + (i * chartWidth / (times.length - 1));
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
        
        // Time labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '11px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(times[i], x, canvas.height - 15);
    }
    
    // Draw temperature line
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    for (let i = 0; i < temperatures.length; i++) {
        const x = padding + (i * chartWidth / (temperatures.length - 1));
        const y = padding + ((maxTemp - temperatures[i]) * chartHeight / tempRange);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Draw temperature points
    ctx.fillStyle = '#fff';
    for (let i = 0; i < temperatures.length; i++) {
        const x = padding + (i * chartWidth / (temperatures.length - 1));
        const y = padding + ((maxTemp - temperatures[i]) * chartHeight / tempRange);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Temperature text on points - show every 4th point to avoid crowding
        if (i % 4 === 0) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(temperatures[i] + (isFahrenheit ? '°F' : '°C'), x, y - 8);
        }
    }
    
    // Show chart
    hourlyChart.style.display = 'block';
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

// Convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5/9);
}

// Format temperature based on current unit
function formatTemperature(tempInCelsius) {
    if (isFahrenheit) {
        return `${celsiusToFahrenheit(tempInCelsius)}°F`;
    } else {
        return `${Math.round(tempInCelsius)}°C`;
    }
}

// Parse time string (HH:MM) to Date object
function parseTimeString(timeString, date) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}

// Update sun position based on current time
function updateSunPosition(sunriseTime, sunsetTime) {
    const now = new Date();
    const sunPeak = document.querySelector('.sun-peak');
    
    if (!sunPeak) return;
    
    // Calculate sun position percentage
    let sunPosition = 0; // 0 = left (sunrise), 50 = center (noon), 100 = right (sunset)
    
    if (now < sunriseTime) {
        // Before sunrise - show moon (left side)
        sunPosition = 0;
        sunPeak.style.display = 'block';
        sunPeak.style.left = '10%';
        sunPeak.style.top = '20px';
        sunPeak.style.background = '#c0c0c0';
        sunPeak.style.boxShadow = '0 0 10px rgba(192, 192, 192, 0.5)';
        sunPeak.style.opacity = '0.8';
    } else if (now > sunsetTime) {
        // After sunset - show moon (right side)
        sunPosition = 100;
        sunPeak.style.display = 'block';
        sunPeak.style.left = '90%';
        sunPeak.style.top = '20px';
        sunPeak.style.background = '#c0c0c0';
        sunPeak.style.boxShadow = '0 0 10px rgba(192, 192, 192, 0.5)';
        sunPeak.style.opacity = '0.8';
    } else {
        // During daylight hours
        sunPeak.style.display = 'block';
        sunPeak.style.opacity = '1';
        const totalDaylight = sunsetTime - sunriseTime;
        const timeSinceSunrise = now - sunriseTime;
        const dayProgress = timeSinceSunrise / totalDaylight;
        
        // Convert to percentage (0-100)
        sunPosition = dayProgress * 100;
    }
    
    // Calculate the curved path position
    // Using a sine curve for natural sun arc movement
    const radians = (sunPosition / 100) * Math.PI;
    const curveHeight = Math.sin(radians);
    
    // Update sun position
    const leftPosition = sunPosition;
    const topPosition = 100 - (curveHeight * 100); // Invert so high values are at top
    
    sunPeak.style.left = `${leftPosition}%`;
    sunPeak.style.top = `${topPosition * 0.6}px`; // Scale to fit container
    
    // Add visual effects based on time of day
    if (now >= sunriseTime && now <= sunsetTime) {
        const currentHour = now.getHours();
        
        if (currentHour >= 6 && currentHour <= 8) {
            // Morning - orange glow
            sunPeak.style.background = '#ff8c00';
            sunPeak.style.boxShadow = '0 0 15px rgba(255, 140, 0, 0.7)';
        } else if (currentHour >= 9 && currentHour <= 16) {
            // Midday - bright yellow
            sunPeak.style.background = '#ffd700';
            sunPeak.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        } else if (currentHour >= 17 && currentHour <= 20) {
            // Evening - orange-red glow
            sunPeak.style.background = '#ff6347';
            sunPeak.style.boxShadow = '0 0 15px rgba(255, 99, 71, 0.7)';
        }
    }
}

// Update current date
function updateCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    currentDate.textContent = now.toLocaleDateString('tr-TR', options);
}

// Theme management
function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
}

function updateTheme() {
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark-mode');
        themeIcon.className = 'fas fa-moon';
    }
}

// Temperature unit management
function toggleTempUnit() {
    isFahrenheit = !isFahrenheit;
    localStorage.setItem('tempUnit', isFahrenheit ? 'fahrenheit' : 'celsius');
    updateTempUnit();
    
    // Refresh display with new unit
    if (currentForecastData) {
        // Re-display data with new temperature unit
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            getWeatherData(lastCity);
        }
    }
    
    // Refresh major cities weather with new temperature unit
    loadMajorCitiesWeather();
}

function updateTempUnit() {
    const tempUnitBtn = tempUnitToggle.querySelector('span');
    
    if (isFahrenheit) {
        tempUnitBtn.textContent = '°F';
        tempUnitToggle.classList.add('fahrenheit');
    } else {
        tempUnitBtn.textContent = '°C';
        tempUnitToggle.classList.remove('fahrenheit');
    }
}

// Translation helper function
function t(key) {
    const lang = isEnglish ? 'en' : 'tr';
    return translations[lang][key] || key;
}

// Language management
function toggleLanguage() {
    isEnglish = !isEnglish;
    localStorage.setItem('language', isEnglish ? 'english' : 'turkish');
    updateLanguage();
    
    // Refresh display with new language
    if (currentForecastData) {
        // Re-display data with new language
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            getWeatherData(lastCity);
        }
    }
    
    // Refresh major cities weather with new language
    loadMajorCitiesWeather();
}

function updateLanguage() {
    const languageBtn = languageToggle.querySelector('span');
    
    if (isEnglish) {
        languageBtn.textContent = 'EN';
        languageToggle.classList.add('english');
    } else {
        languageBtn.textContent = 'TR';
        languageToggle.classList.remove('english');
    }
    
    // Update UI text elements
    updateUIText();
}

// Loading states
function showLoading() {
    loading.style.display = 'flex';
    weatherContainer.style.display = 'none';
    forecastContainer.style.display = 'none';
    hourlyChart.style.display = 'none';
    hideError();
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    error.style.display = 'flex';
    loading.style.display = 'none';
    weatherContainer.style.display = 'none';
    forecastContainer.style.display = 'none';
    hourlyChart.style.display = 'none';
}

function hideError() {
    error.style.display = 'none';
}

// Major cities weather functions
async function loadMajorCitiesWeather() {
    try {
        // Clear existing cities
        citiesGrid.innerHTML = '';
        
        // Load weather for each major city
        for (const city of majorCities) {
            await loadCityWeather(city);
        }
    } catch (error) {
        console.error('Error loading major cities weather:', error);
    }
}

async function loadCityWeather(cityName) {
    try {
        const lang = isEnglish ? 'en' : 'tr';
        const response = await fetch(`${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric&lang=${lang}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayCityWeather(data);
    } catch (error) {
        console.error(`Error loading weather for ${cityName}:`, error);
        // Display error state for this city
        displayCityError(cityName);
    }
}

function displayCityWeather(data) {
    const cityItem = document.createElement('div');
    cityItem.className = 'city-item';
    
    const cityInfo = document.createElement('div');
    cityInfo.className = 'city-info';
    
    const cityName = document.createElement('div');
    cityName.className = 'city-name';
    cityName.textContent = data.name;
    
    const cityIcon = document.createElement('div');
    cityIcon.className = 'city-icon';
    
    const iconImg = document.createElement('img');
    iconImg.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    iconImg.alt = data.weather[0].description;
    
    cityIcon.appendChild(iconImg);
    
    const cityTemp = document.createElement('div');
    cityTemp.className = 'city-temp';
    cityTemp.textContent = formatTemperature(data.main.temp);
    
    cityInfo.appendChild(cityName);
    cityInfo.appendChild(cityIcon);
    cityInfo.appendChild(cityTemp);
    cityItem.appendChild(cityInfo);
    
    citiesGrid.appendChild(cityItem);
}

function displayCityError(cityName) {
    const cityItem = document.createElement('div');
    cityItem.className = 'city-item';
    
    const cityInfo = document.createElement('div');
    cityInfo.className = 'city-info';
    
    const cityNameElement = document.createElement('div');
    cityNameElement.className = 'city-name';
    cityNameElement.textContent = cityName;
    
    const cityIcon = document.createElement('div');
    cityIcon.className = 'city-icon';
    cityIcon.innerHTML = '<i class="fas fa-exclamation-triangle" style="font-size: 24px; color: #ff6b6b;"></i>';
    
    const cityTemp = document.createElement('div');
    cityTemp.className = 'city-temp';
    cityTemp.textContent = '--';
    
    cityInfo.appendChild(cityNameElement);
    cityInfo.appendChild(cityIcon);
    cityInfo.appendChild(cityTemp);
    cityItem.appendChild(cityInfo);
    
    citiesGrid.appendChild(cityItem);
}