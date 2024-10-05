'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { SearchIcon, Droplets, Wind, Sun, Thermometer, Eye, Compass } from 'lucide-react';
import { useMap } from 'react-leaflet';
import Image from 'next/image';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

type WeatherData = {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  dewPoint: number;
  visibility: number;
  icon: string;
  cityName: string;
  country: string;
  datetime: string;
  lat: number;
  lon: number;
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}

export default function WeatherDashboard() {
  const [city, setCity] = useState('Manila');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.error || 'Failed to fetch weather data');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const getWindDirection = (degree: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degree / 22.5) % 16];
  };

  return (
    <div className="min-h-screen bg-[url('/dashboardbg.png')] bg-no-repeat bg-cover bg-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'linear' }}
        className="w-full"
      >
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-4xl font-bold text-center text-white mb-8">Weather Dashboard</h1>
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-grow px-4 py-2 rounded-l-md border text-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </div>
          </form>

          {loading && <p className="text-center text-xl text-white">Loading...</p>}
          {error && <p className="text-center text-xl text-red-500">{error}</p>}

          {weatherData && (
            <div className="bg-blue-200 dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-semibold dark:text-white">
                    {weatherData.cityName}, {weatherData.country}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{weatherData.datetime}</p>
                </div>
                <div className="flex items-center">
                  <Image
                    src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                    alt={weatherData.condition}
                    className="w-16 h-16"
                    width={64} // Required for Next.js Image component
                    height={64} // Required for Next.js Image component
                  />
                  <span className="text-3xl lg:text-5xl ml-4 dark:text-white">{weatherData ? weatherData.temp : 'N/A'}°C</span>
                </div>
              </div>
              <p className="text-xl mb-6 capitalize dark:text-white">
                {weatherData.condition}. {weatherData.windSpeed < 3.3 ? 'Light breeze' : 'Moderate wind'}
              </p>

              <div className="mb-6 h-64 rounded-lg overflow-hidden">
                <MapContainer center={[weatherData.lat, weatherData.lon]} zoom={10} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[weatherData.lat, weatherData.lon]} />
                  <ChangeView center={[weatherData.lat, weatherData.lon]} />
                </MapContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Temperature</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Thermometer className="h-6 w-6 text-red-500 dark:text-red-400 mr-2" />
                    <span>Feels like: {weatherData.feelsLike}°C</span>
                  </div>
                  <div className="mt-2 dark:text-gray-200">
                    <span>Dew point: {weatherData.dewPoint}°C</span>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Humidity</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Droplets className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
                    <span>{weatherData.humidity}%</span>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Wind</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Wind className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2" />
                    <span>{weatherData.windSpeed.toFixed(1)} m/s</span>
                  </div>
                  <div className="flex items-center mt-2 dark:text-gray-200">
                    <Compass className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2" />
                    <span>{getWindDirection(weatherData.windDirection)}</span>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Pressure</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Sun className="h-6 w-6 text-orange-500 dark:text-orange-400 mr-2" />
                    <span>{weatherData.pressure} hPa</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Visibility</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Eye className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-2" />
                    <span>{weatherData.visibility.toFixed(1)} km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}