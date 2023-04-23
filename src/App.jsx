import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherApp.css';

function WeatherApp() {
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState('');
  const [condition, setCondition] = useState('');
  const [icon, setIcon] = useState('');
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [feelsLike, setFeelsLike] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [windDirection, setWindDirection] = useState('');
  const [sunriseTime, setSunriseTime] = useState('');
  const [sunsetTime, setSunsetTime] = useState('');
  const [isMetric, setIsMetric] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = '9d08960a02b2f526e8962529e1c3f443';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
  const API_ICON_URL = 'https://openweathermap.org/img/wn/';
  function getWindDirection(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((degrees % 360) / 45);
    return directions[index];
  }
  function convertTime(unixTime) {
    const date = new Date(unixTime * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }
  function convertTemp(temp) {
    if (isMetric) {
      return Math.round(temp);
    } else {
      return Math.round(temp * 9 / 5 + 32);
    }
  }
  function convertSpeed(speed) {
    if (isMetric) {
      return Math.round(speed);
    } else {
      return Math.round(speed * 2.237);
    }
  }
  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .get(API_URL, {
            params: {
              lat: latitude,
              lon: longitude,
              appid: API_KEY,
              units: 'metric',
            },
          })
          .then((response) => {
            setTemperature(Math.floor(response.data.main.temp));
            setCondition(response.data.weather[0].description);
            setIcon(response.data.weather[0].icon);
            setCityName(response.data.name);
            setLoading(false);
            setFeelsLike(response.data.main.feels_like);
            setHumidity(response.data.main.humidity);
            setWindSpeed(response.data.wind.speed);
            setWindDirection(response.data.wind.deg);
            setSunriseTime(response.data.sys.sunrise);
            setSunsetTime(response.data.sys.sunset);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  }, []);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .get(API_URL, {
        params: {
          q: location,
          appid: API_KEY,
          units: 'metric',
        },
      })
      .then((response) => {
        setTemperature(response.data.main.temp);
        setCondition(response.data.weather[0].description);
        setIcon(response.data.weather[0].icon);
        setCityName(response.data.name);
        setFeelsLike(response.data.main.feels_like);
        setHumidity(response.data.main.humidity);
        setWindSpeed(response.data.wind.speed);
        setWindDirection(response.data.wind.deg);
        setSunriseTime(response.data.sys.sunrise);
        setSunsetTime(response.data.sys.sunset);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getBackgroundClass = () => {
    switch (condition) {
      case 'clear sky':
        return 'bg-gradient-to-b from-yellow-200 to-orange-500';
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return 'bg-gradient-to-b from-blue-200 to-blue-500';
      case 'shower rain':
      case 'rain':
      case 'thunderstorm':
        return 'bg-gradient-to-b from-gray-500 to-gray-800';
      case 'snow':
        return 'bg-gradient-to-b from-white to-blue-300';
      case 'haze':
        return 'bg-gradient-to-b from-gray-200 to-gray-400';
      default:
        return 'bg-gradient-to-b from-blue-400 to-purple-500';
    }
  };

  return (
    <div className={getBackgroundClass() + ' min-h-screen flex flex-col justify-center items-center text-white font-bold'}>
      <h1 className="text-3xl mb-4">{cityName ? cityName : 'Fetching Weather Data'}</h1>
      {loading && (
        <div className="oscillating-circles">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      )}
      {!loading && temperature && (
        <div className="mt-16 flex-wrap">
          <div className="flex items-center justify-center rounded-md shadow-md p-4">
            <img
              src={`${API_ICON_URL}${icon}@2x.png`}
              alt={condition}
              className="mr-4 w-16 h-16"
            />
            <div className="text-6xl">{convertTemp(temperature)}&deg;</div>
          </div>
          <div className="text-2xl mt-4 rounded-md shadow-md p-4">{condition}</div>
          <div className="text-xl mt-4 rounded-md shadow-md p-4">Feels like: {feelsLike}&deg;</div>
          <div className="text-xl mt-4 rounded-md shadow-md p-4">Humidity: {humidity}%</div>
          <div className="text-xl mt-4 rounded-md shadow-md p-4">Wind: {convertSpeed(windSpeed)} km/h {getWindDirection(windDirection)}</div>
          <div className="text-xl mt-4 rounded-md shadow-md p-4">Sunrise: {convertTime(sunriseTime)}</div>
          <div className="text-xl mt-4 rounded-md shadow-md p-4">Sunset: {convertTime(sunsetTime)}</div>
        </div>
      )}
    </div>
  );  
}

export default WeatherApp;