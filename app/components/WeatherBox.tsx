import React from 'react';
import { Wind, Waves, Thermometer, Droplets } from 'lucide-react';

interface WeatherBoxProps {
  weatherData: any;
  getWeatherIcon: (code: number) => React.ReactNode;
  getWeatherDescription: (code: number) => string;
  getSurfConditions: (windSpeed: number, waveHeight: number, weatherCode: number) => any;
}

const WeatherBox: React.FC<WeatherBoxProps> = ({ weatherData, getWeatherIcon, getWeatherDescription, getSurfConditions }) => (
  <div className="max-w-6xl mx-auto">
    {/* Current Weather */}
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{weatherData.cityName}</h2>
          <p className="text-gray-600">Current Conditions</p>
        </div>
        <div className="text-right md:flex md:flex-row-reverse md:items-center md:gap-x-4">
          <div className="text-4xl font-bold text-gray-800 mb-1">
            {Math.round(weatherData.current_weather.temperature)}°C
          </div>
          {getWeatherIcon(weatherData.current_weather.weathercode)}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <Wind className="w-6 h-6 text-blue-500 mb-2" />
          <div className="text-sm text-gray-600">Wind Speed</div>
          <div className="text-xl font-semibold">{weatherData.current_weather.windspeed} km/h</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="w-6 h-6 text-green-500 mb-2 font-bold text-lg">°</div>
          <div className="text-sm text-gray-600">Wind Direction</div>
          <div className="text-xl font-semibold">{weatherData.current_weather.winddirection}°</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <Thermometer className="w-6 h-6 text-purple-500 mb-2" />
          <div className="text-sm text-gray-600">Weather</div>
          <div className="text-sm font-semibold">{getWeatherDescription(weatherData.current_weather.weathercode)}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <Waves className="w-6 h-6 text-orange-500 mb-2" />
          <div className="text-sm text-gray-600">Surf Conditions</div>
          <div className={`text-sm font-semibold ${getSurfConditions(weatherData.current_weather.windspeed, 1, weatherData.current_weather.weathercode).color}`}>
            {getSurfConditions(weatherData.current_weather.windspeed, 1, weatherData.current_weather.weathercode).condition}
          </div>
        </div>
      </div>
    </div>
    {/* 7-Day Forecast */}
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">7-Day Surf Forecast</h3>
      <div className="grid gap-4">
        {weatherData.daily.time.map((date: string, index: number) => {
          const windSpeed = weatherData.daily.windspeed_10m_max[index];
          const weatherCode = weatherData.daily.weathercode[index];
          const surfCondition = getSurfConditions(windSpeed, 1.5, weatherCode);
          return (
            <div key={date} className="flex items-center justify-between max-sm:flex-col max-sm:border-b border-b-black/20 p-4  hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="text-gray-600 font-medium min-w-[100px] whitespace-nowrap">
                  {new Date(date).toLocaleDateString('de-DE', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                {getWeatherIcon(weatherCode)}
                <div>
                  <div className="font-medium text-gray-800">{getWeatherDescription(weatherCode)}</div>
                  <div className="text-sm text-gray-500">
                    {Math.round(weatherData.daily.temperature_2m_min[index])}° - {Math.round(weatherData.daily.temperature_2m_max[index])}°
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6 max-sm:mt-3">
                <div className="text-center">
                  <Wind className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">{Math.round(windSpeed)} km/h</div>
                </div>
                <div className="text-center">
                  <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-sm">{Math.round(weatherData.daily.precipitation_sum[index])}mm</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${surfCondition.bgColor} ${surfCondition.color} min-w-[80px] text-center`}>
                  {surfCondition.condition}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default WeatherBox;
