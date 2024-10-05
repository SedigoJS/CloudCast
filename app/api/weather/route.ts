import { NextResponse } from 'next/server'

const API_KEY = process.env.OPENWEATHERMAP_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json({ error: 'City parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    )
    const data = await response.json()

    if (response.ok) {
      return NextResponse.json({
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        pressure: data.main.pressure,
        dewPoint: Math.round(data.main.temp - (100 - data.main.humidity) / 5),
        visibility: data.visibility / 1000,
        icon: data.weather[0].icon,
        cityName: data.name,
        country: data.sys.country,
        datetime: new Date(data.dt * 1000).toLocaleString(),
        lat: data.coord.lat,
        lon: data.coord.lon,
      })
    } else {
      return NextResponse.json({ error: data.message }, { status: response.status })
    }
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}