import { useState, useEffect } from "react";

export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [background, setBackground] = useState("bg-blue-500");

  const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  // Fetch weather using current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  }, []);

  // Function to update background based on weather condition
  const updateBackground = (weatherCondition) => {
    console.log("Weather condition:", weatherCondition);
    
    const condition = weatherCondition.toLowerCase();
    if (condition.includes("rain")) {
      setBackground("bg-gray-700");
    } else if (condition.includes("cloud")) {
      setBackground("bg-gray-400");
    } else if (condition.includes("clear")) {
      setBackground("bg-blue-500");
    } else if (condition.includes("snow")) {
      setBackground("bg-white");
    } else {
      setBackground("bg-green-500");
    }
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
      if (data.weather && data.weather.length > 0) {
        updateBackground(data.weather[0].main);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async () => {
    if (!city) return;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
      if (data.weather && data.weather.length > 0) {
        updateBackground(data.weather[0].main);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col items-center justify-center ${background}`}>
      <h1 className="text-3xl font-bold text-white mb-4">Weather App</h1>
      
      {/* Input for city search */}
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        className="p-2 rounded border"
      />
      <button onClick={fetchWeatherByCity} className="mt-2 p-2 bg-white rounded">Search</button>

      {/* Weather Display */}
      {weather && (
        <div className="text-white mt-4 text-center">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p>{weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
