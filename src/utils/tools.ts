import { tool } from "ai";
import { z } from "zod";
import { GeocodingResponse, GeocodingResult } from "../types/Geocoding";
import { WeatherResponse } from "../types/WeatherResponse";
import { logger } from "./logger";

export const weatherTool = tool({
  description: "Get the current weather and forecast for a location by name",
  inputSchema: z.object({
    name: z
      .string()
      .describe(
        "The location name to get the weather for (e.g., 'New York', 'London', 'Tokyo')",
      ),
  }),
  execute: async ({ name }) => {
    try {
      // First geocode the location
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`,
      );

      if (!geoResponse.ok) {
        logger.error(`Geocoding API error: ${geoResponse.status}`);
        throw new Error(`Geocoding API error: ${geoResponse.status}`);
      }

      const geoData = (await geoResponse.json()) as GeocodingResponse;

      if (!geoData.results || geoData.results.length === 0) {
        logger.error(`Weather API error: Location "${name}" not found`);
        return {
          success: false,
          error: `Location "${name}" not found`,
        };
      }

      const geoResult = geoData.results[0];
      logger.info(`found geodata for ${name}:\n${geoData}`);

      // Then get the forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${geoResult.latitude}&longitude=${geoResult.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
      );

      if (!weatherResponse.ok) {
        logger.error(`Weather API error: ${weatherResponse.status}`);
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      const weatherData = (await weatherResponse.json()) as WeatherResponse;

      return {
        success: true,
        location: geoResult.name,
        country: geoResult.country,
        coordinates: {
          latitude: geoResult.latitude,
          longitude: geoResult.longitude,
        },
        timezone: weatherData.timezone,
        current: {
          temperature: weatherData.current.temperature_2m,
          apparentTemperature: weatherData.current.apparent_temperature,
          humidity: weatherData.current.relative_humidity_2m,
          precipitation: weatherData.current.precipitation,
          windSpeed: weatherData.current.wind_speed_10m,
          weatherCode: weatherData.current.weather_code,
        },
        daily: {
          dates: weatherData.daily.time,
          temperatureMax: weatherData.daily.temperature_2m_max,
          temperatureMin: weatherData.daily.temperature_2m_min,
          precipitationSum: weatherData.daily.precipitation_sum,
          weatherCodes: weatherData.daily.weather_code,
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
