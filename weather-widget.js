class WeatherWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          color: white;
          font-family: Arial, sans-serif;
          transition: background 0.5s ease;
        }
  
        h2 {
          font-size: 1.8em;
          margin: 10px 0;
          color: #ffcc00;
          font-weight: bold;
        }
  
        p {
          margin: 8px 0;
          font-size: 1.2em;
        }
  
        select {
          margin: 10px 0;
          padding: 8px 12px;
          font-size: 1.1em;
          border: none;
          border-radius: 5px;
          background: #ffcc00;
          color: #000;
          cursor: pointer;
          transition: all 0.3s;
        }
  
        select:hover {
          background: #ff9933;
        }
  
        .weather-info {
          margin-top: 20px;
          font-size: 1.1em;
        }
  
        .weather-info p {
          margin: 8px 0;
        }
  
        strong {
          color: #ffcc00;
        }
      `;
      this.shadowRoot.appendChild(style);
  
      this.container = document.createElement('div');
      this.shadowRoot.appendChild(this.container);
  
      this.countrySelect = document.createElement('select');
      this.countrySelect.innerHTML = `
        <option value="ru">Россия</option>
        <option value="us">США</option>
        <option value="fr">Франция</option>
        <option value="jp">Япония</option>
        <option value="tj">Таджикистан</option>
        <option value="md">Молдавия</option>
        <option value="il">Израиль</option>
        <option value="az">Азербайджан</option>
        <option value="tr">Турция</option>
      `;
      this.countrySelect.addEventListener('change', () => this.updateCities());
      this.shadowRoot.appendChild(this.countrySelect);
  
      this.citySelect = document.createElement('select');
      this.citySelect.addEventListener('change', () => this.updateWeather());
      this.shadowRoot.appendChild(this.citySelect);
  
      this.weatherInfo = document.createElement('div');
      this.weatherInfo.classList.add('weather-info');
      this.shadowRoot.appendChild(this.weatherInfo);
  
      this.updateCities(); 
    }
  
    updateCities() {
      const cities = {
        ru: [
          { name: 'Москва', lat: 55.7558, lon: 37.6176 },
          { name: 'Санкт-Петербург', lat: 59.9343, lon: 30.3351 },
          { name: 'Сочи', lat: 43.5855, lon: 39.7231 },
          { name: 'Екатеринбург', lat: 56.8389, lon: 60.6057 },
          { name: 'Новосибирск', lat: 55.0084, lon: 82.9357 },
          { name: 'Рязань', lat: 54.6290, lon: 39.7188 },
          { name: 'Челябинск', lat: 55.1548, lon: 61.4291 },
        ],
        us: [
          { name: 'Нью-Йорк', lat: 40.7128, lon: -74.0060 },
          { name: 'Лос-Анджелес', lat: 34.0522, lon: -118.2437 },
          { name: 'Чикаго', lat: 41.8781, lon: -87.6298 },
          { name: 'Даллас', lat: 32.7767, lon: -96.7970 },
          { name: 'Майами', lat: 25.7617, lon: -80.1918 },
        ],
        fr: [
          { name: 'Париж', lat: 48.8566, lon: 2.3522 },
          { name: 'Марсель', lat: 43.2965, lon: 5.3698 },
          { name: 'Лион', lat: 45.7640, lon: 4.8357 },
          { name: 'Ницца', lat: 43.7102, lon: 7.2620 },
          { name: 'Тулуза', lat: 43.6047, lon: 1.4442 },
        ],
        jp: [
          { name: 'Токио', lat: 35.6895, lon: 139.6917 },
          { name: 'Осака', lat: 34.6937, lon: 135.5023 },
          { name: 'Киото', lat: 35.0116, lon: 135.7681 },
          { name: 'Хиросима', lat: 34.3853, lon: 132.4553 },
          { name: 'Саппоро', lat: 43.0667, lon: 141.3500 },
        ],
        tj: [
          { name: 'Душанбе', lat: 38.5357, lon: 68.7791 },
          { name: 'Худжанд', lat: 40.2833, lon: 69.6000 },
          { name: 'Бохтар', lat: 37.8700, lon: 68.7833 },
        ],
        md: [
          { name: 'Кишинёв', lat: 47.0105, lon: 28.8638 },
          { name: 'Бельцы', lat: 47.7465, lon: 27.8700 },
          { name: 'Тирасполь', lat: 46.8600, lon: 29.6278 },
          { name: 'Чадыр-Лунга', lat: 45.8950, lon: 28.6400 },  
        ],
        il: [
          { name: 'Тель-Авив', lat: 32.0853, lon: 34.7818 },
          { name: 'Иерусалим', lat: 31.7683, lon: 35.2137 },
          { name: 'Хайфа', lat: 32.7940, lon: 34.9896 },
        ],
        az: [
          { name: 'Баку', lat: 40.4093, lon: 49.8671 },
          { name: 'Гянджа', lat: 40.6828, lon: 46.3601 },
          { name: 'Мингечевир', lat: 40.7499, lon: 47.0602 },
        ],
        tr: [
          { name: 'Стамбул', lat: 41.0082, lon: 28.9784 },
          { name: 'Анкара', lat: 39.9334, lon: 32.8597 },
          { name: 'Измир', lat: 38.4192, lon: 27.1287 },
        ],
      };
  
      const selectedCountry = this.countrySelect.value;
      const selectedCities = cities[selectedCountry] || [];
      this.citySelect.innerHTML = selectedCities
        .map(city => `<option value="${city.lat},${city.lon}">${city.name}</option>`)
        .join('');
      this.updateWeather(); 
    }
  
    updateWeather() {
      const [latitude, longitude] = this.citySelect.value.split(',');
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,relative_humidity_2m,pressure_msl,visibility,weathercode&timezone=auto`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.current_weather) {
            this.renderWeather(data);
          } else {
            throw new Error("Нет данных о погоде");
          }
        })
        .catch(error => {
          console.error('Ошибка при получении данных о погоде:', error);
          this.weatherInfo.innerHTML = '<p>Ошибка при загрузке данных. Попробуйте позже.</p>';
        });
    }
  
    renderWeather(data) {
      const currentWeather = data.current_weather;
      const temperature = `${currentWeather.temperature}°C`;
      const windSpeed = `${currentWeather.windspeed} м/с`;
      const humidity = `${data.hourly.relative_humidity_2m[0]}%`;
      const visibility = `${(data.hourly.visibility[0] / 1000).toFixed(1)} км`;
      const pressure = data.hourly.pressure_msl[0] ? `${data.hourly.pressure_msl[0]} hPa` : 'N/A';
      const weatherCode = currentWeather.weathercode;
  
      let weatherCondition = '';
      let backgroundColor = '';
  
      switch (weatherCode) {
        case 0: 
          weatherCondition = 'Ясно';
          backgroundColor = 'linear-gradient(to bottom, #00bfff, #87cefa)';
          break;
        case 1: 
        case 2:
          weatherCondition = 'Облачно';
          backgroundColor = 'linear-gradient(to bottom, #f7d08b, #f1b47d)';
          break;
        case 3: 
          weatherCondition = 'Пасмурно';
          backgroundColor = 'linear-gradient(to bottom, #a9a9a9, #696969)';
          break;
        case 45: 
        case 48: 
          weatherCondition = 'Туман';
          backgroundColor = 'linear-gradient(to bottom, #808080, #d3d3d3)';
          break;
        case 51: 
        case 53: 
        case 55: 
          weatherCondition = 'Дождь';
          backgroundColor = 'linear-gradient(to bottom, #6a5acd, #8a2be2)';
          break;
        case 61: 
        case 63: 
        case 65: 
          weatherCondition = 'Ливень';
          backgroundColor = 'linear-gradient(to bottom, #00bfff, #1e90ff)';
          break;
        case 80: 
          weatherCondition = 'Гроза';
          backgroundColor = 'linear-gradient(to bottom, #ff4500, #ff6347)';
          break;
        default:
          weatherCondition = 'Неизвестно';
          backgroundColor = 'linear-gradient(to bottom, #808080, #d3d3d3)';
      }
  
      this.weatherInfo.innerHTML = `
        <p><strong>Температура:</strong> ${temperature}</p>
        <p><strong>Ветер:</strong> ${windSpeed}</p>
        <p><strong>Влажность:</strong> ${humidity}</p>
        <p><strong>Видимость:</strong> ${visibility}</p>
        <p><strong>Давление:</strong> ${pressure}</p>
        <p><strong>Условия:</strong> ${weatherCondition}</p>
      `;
  
      this.container.style.background = backgroundColor;
      document.body.style.background = backgroundColor;
    }
  }
  
  customElements.define('weather-widget', WeatherWidget);
  