import React, { useState, useEffect } from 'react';
import { Waves, Sun, Cloud, CloudRain, CloudSnow } from 'lucide-react';
import SearchBar from './components/SearchBar';
import PopularSpots from './components/PopularSpots';
import WeatherBox from './components/WeatherBox';
import ErrorBox from './components/ErrorBox';
import LoadingBox from './components/LoadingBox';

// Type for weatherData
interface WeatherData {
  cityName: string;
  current_weather: {
  temperature: number;
  weathercode: number;
  windspeed: number;
  winddirection: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    windspeed_10m_max: number[];
    windgusts_10m_max: number[];
    winddirection_10m_dominant: number[];
    precipitation_sum: number[];
    visibility: number[];
  };
}

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [weatherBoxVisible, setWeatherBoxVisible] = useState(false);

  // German coastal cities for surfers
  const popularSpots = [
    { name: 'Sylt', lat: 54.9064, lon: 8.3406 },
    { name: 'Sankt Peter-Ording', lat: 54.3089, lon: 8.6022 },
    { name: 'Fehmarn', lat: 54.4371, lon: 11.1858 },
    { name: 'Warnemünde', lat: 54.1776, lon: 12.0831 },
    { name: 'Norderney', lat: 53.7067, lon: 7.1486 },
    { name: 'Westerland', lat: 54.9020, lon: 8.3052 }
  ];

  const getWeatherIcon = (weatherCode: number, isDay: boolean = true) => {
    if (weatherCode <= 1) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (weatherCode <= 3) return <Cloud className="w-8 h-8 text-gray-500" />;
    if (weatherCode <= 67) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (weatherCode <= 77) return <CloudSnow className="w-8 h-8 text-blue-200" />;
    return <Cloud className="w-8 h-8 text-gray-600" />;
  };

  const getWeatherDescription = (weatherCode: number) => {
    const descriptions = {
      0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
      55: 'Dense drizzle', 56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain',
      67: 'Heavy freezing rain', 71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      77: 'Snow grains', 80: 'Slight rain showers', 81: 'Moderate rain showers',
      82: 'Violent rain showers', 85: 'Slight snow showers', 86: 'Heavy snow showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[weatherCode as keyof typeof descriptions] || 'Unknown';
  };

  const getSurfConditions = (windSpeed: number, waveHeight: number, weatherCode: number) => {
    let condition = 'Poor';
    let color = 'text-red-500';
    let bgColor = 'bg-red-100';
    if (windSpeed >= 8 && windSpeed <= 25 && weatherCode <= 3) {
      condition = 'Excellent';
      color = 'text-green-500';
      bgColor = 'bg-green-100';
    } else if (windSpeed >= 6 && windSpeed <= 30 && weatherCode <= 67) {
      condition = 'Good';
      color = 'text-blue-500';
      bgColor = 'bg-blue-100';
    } else if (windSpeed >= 4 && weatherCode <= 77) {
      condition = 'Fair';
      color = 'text-yellow-500';
      bgColor = 'bg-yellow-100';
    }
    return { condition, color, bgColor };
  };

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&country=DE&count=5&language=en&format=json`
      );
      const data = await response.json();
      const germanSuggestions = (data.results || []).filter((s: any) => s.country_code === 'DE');
      setSuggestions(germanSuggestions);
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, cityName: string) => {
    setLoading(true);
    setError('');
    setWeatherBoxVisible(false);
    setTimeout(async () => {
      try {
        const today = new Date();
        const startDate = today.toISOString().slice(0, 10);
        const endDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant,precipitation_sum&current_weather=true&timezone=Europe/Berlin&start_date=${startDate}&end_date=${endDate}`
        );
        if (!response.ok) throw new Error('Weather data unavailable');
        const data = await response.json();
        setWeatherData({ ...data, cityName });
        setSuggestions([]);
        setLocation('');
        setTimeout(() => setWeatherBoxVisible(true), 10);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 200);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const first = suggestions[0];
      if (first.country !== 'Germany' && first.country !== 'Deutschland' && first.country_code !== 'DE') {
        setError('Only cities in Germany are allowed.');
        return;
      }
      fetchWeatherData(first.latitude, first.longitude, first.name);
    } else {
      setError('Please select a city from the suggestions.');
    }
  };

  const selectSuggestion = (suggestion: any) => {
    if (suggestion.country !== 'Germany' && suggestion.country !== 'Deutschland' && suggestion.country_code !== 'DE') {
      setError('Only cities in Germany are allowed.');
      return;
    }
    fetchWeatherData(suggestion.latitude, suggestion.longitude, suggestion.name);
  };

  const selectPopularSpot = (spot: any) => {
    fetchWeatherData(spot.lat, spot.lon, spot.name);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setActiveSuggestion((prev) => Math.max(prev - 1, 0));
        e.preventDefault();
      } else if (e.key === 'Enter' && activeSuggestion >= 0) {
        selectSuggestion(suggestions[activeSuggestion]);
        setActiveSuggestion(-1);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setSuggestions([]);
        setActiveSuggestion(-1);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocations(location);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [location]);

  useEffect(() => {
    if (weatherData) {
      setWeatherBoxVisible(false);
      setTimeout(() => setWeatherBoxVisible(true), 10);
    } else {
      setWeatherBoxVisible(false);
    }
  }, [weatherData]);

  const rippleStyle = `
    .ripple {
      position: absolute;
      border-radius: 9999px;
      transform: scale(0);
      animation: ripple 0.6s linear;
      background: rgba(255,255,255,0.4);
      pointer-events: none;
      z-index: 1;
    }
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Waves className="w-12 h-12 text-white mr-3" />
            <h1 className="text-4xl font-bold text-white">SurfWeather</h1>
          </div>
          <p className="text-blue-100 text-lg">Professional weather forecasts for German surf spots</p>
        </div>
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            location={location}
            setLocation={setLocation}
            activeSuggestion={activeSuggestion}
            setActiveSuggestion={setActiveSuggestion}
            suggestions={suggestions}
            selectSuggestion={selectSuggestion}
            handleInputKeyDown={handleInputKeyDown}
          />
          <PopularSpots spots={popularSpots} selectPopularSpot={selectPopularSpot} rippleStyle={rippleStyle} />
        </div>
        {error && <ErrorBox error={error} />}
        {loading && <LoadingBox />}
        {weatherData && (
          <div
            key={weatherData.cityName}
            className="transition-opacity duration-700 ease-in-out w-full relative"
            style={{ opacity: weatherBoxVisible ? 1 : 0, visibility: weatherBoxVisible ? 'visible' : 'hidden' }}
          >
            <WeatherBox
              weatherData={weatherData}
              getWeatherIcon={getWeatherIcon}
              getWeatherDescription={getWeatherDescription}
              getSurfConditions={getSurfConditions}
            />
          </div>
        )}
      </div>
      <style>{rippleStyle}</style>
    </div>
  );
};

export default App;

