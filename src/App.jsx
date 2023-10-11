import React, { useState, useEffect } from 'react';

import {
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiBarometer,
  WiThermometer,
  WiThermometerExterior,
  WiWindDeg,
} from 'weather-icons-react';
// import api from "./services/api";

const api = {
  key: '8d4cdf8f8a1e4cb1a3f8e886d69e86c3',
  base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [cityNotFound, setCityNotFound] = useState(false);
  const [alreadySearched, setAlreadySearched] = useState(false);

  const [feelsLike, setFeelsLike] = useState('');
  const [wind, setWind] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [visibility, setVisibility] = useState('');

  const search = event => {
    if (event.key === 'Enter') {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          if (result.cod === '404') {
            if (typeof weather.main !== 'undefined' || alreadySearched) {
              setWeather({});
              setAlreadySearched(true);
            }
            setCityNotFound(true);
          } else {
            setWeather(result);
            setQuery('');
            setCityNotFound(false);
            setAlreadySearched(false);
          }
        })
        .catch(() => {
          alert('City not Found');
        });
    }
  };

  const dateBuilder = d => {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  useEffect(() => {
    if (Object.keys(weather).length !== 0) {
      setFeelsLike(Math.floor(weather.main.feels_like) + ' ℃');
      setWind(weather.wind.speed + ' m/s');
      setHumidity(weather.main.humidity + '%');
      setPressure(weather.main.pressure + ' hPa');
      setTempMax(Math.floor(weather.main.temp_max) + ' ℃');
      setTempMin(Math.floor(weather.main.temp_min) + ' ℃');
      setVisibility(weather.visibility + ' m');

      const sunriseTime = new Date(
        weather.sys.sunrise * 1000
      ).toLocaleTimeString();
      const sunsetTime = new Date(
        weather.sys.sunset * 1000
      ).toLocaleTimeString();
      setSunrise(sunriseTime);
      setSunset(sunsetTime);
    }
  }, [weather]);
  return (
    <div
      className={
        typeof weather.main != 'undefined'
          ? weather.main.temp > 16
            ? 'app warm'
            : 'app'
          : 'app'
      }
    >
      <main>
        <div className="search">
          <input
            type="text"
            className="search__bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyDown={search}
          />
          {typeof weather.main === 'undefined' && cityNotFound && (
            <div className="search__error">City not found</div>
          )}
        </div>
        {typeof weather.main != 'undefined' ? (
          <div>
            <div className="location">
              <div className="location__city">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="location__date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather">
              <div className="weather__temp">
                {Math.round(weather.main.temp)}℃
              </div>
              <div className="weather__temp-feelslike">
                Feels Like:
                <span> {feelsLike}</span>
              </div>
              <div className="weather__sky">
                {weather.weather[0].main}
                <img
                  src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                  alt="icon"
                  width="100px"
                />
                <br /> {weather.weather[0].description}
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {typeof weather.main != 'undefined' ? (
          <div className="details">
            <div className="details-left">
              <div>
                <WiStrongWind /> Wind speed:
                <span> {wind}</span>
              </div>

              <div>
                <WiThermometer /> Temp Max:
                <span> {tempMax}</span>
              </div>

              <div>
                <WiThermometerExterior /> Temp Min:
                <span> {tempMin}</span>
              </div>

              <div>
                <WiHumidity /> Humidity:
                <span> {humidity}</span>
              </div>
            </div>

            <div className="details-right">
              <div>
                <WiWindDeg /> Visibility:
                <span> {visibility}</span>
              </div>

              <div>
                <WiBarometer /> Pressure:
                <span> {pressure}</span>
              </div>

              <div>
                <WiSunrise /> Sunrise:
                <span> {sunrise}</span>
              </div>

              <div>
                <WiSunset /> Sunset:
                <span> {sunset}</span>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
