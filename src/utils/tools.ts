import { tool } from "ai";
import { z } from "zod";
import { WeatherResponse } from "../types/WeatherResponse";
import { logger } from "./logger";
import { Env } from "../types/Env";

export const weatherTool = (env: Env) => tool({
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
      // Get weather data from WeatherAPI.com
      const apiKey = env.WEATHER_API_KEY;
      if (!apiKey) {
        logger.error("Weather API key not found");
        throw new Error("Weather API key not configured");
      }

      const weatherResponse = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(name)}&days=7&aqi=no&alerts=no`,
      );

      if (!weatherResponse.ok) {
        logger.error(`Weather API error: ${weatherResponse.status}`);
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }

      const weatherData = (await weatherResponse.json()) as WeatherResponse;

      return {
        success: true,
        location: weatherData.location.name,
        country: weatherData.location.country,
        region: weatherData.location.region,
        coordinates: {
          latitude: weatherData.location.lat,
          longitude: weatherData.location.lon,
        },
        timezone: weatherData.location.tz_id,
        localtime: weatherData.location.localtime,
        current: {
          temperature: weatherData.current.temp_c,
          temperatureF: weatherData.current.temp_f,
          feelsLike: weatherData.current.feelslike_c,
          feelsLikeF: weatherData.current.feelslike_f,
          humidity: weatherData.current.humidity,
          precipitation: weatherData.current.precip_mm,
          precipitationIn: weatherData.current.precip_in,
          cloud: weatherData.current.cloud,
          uv: weatherData.current.uv,
          gustMph: weatherData.current.gust_mph,
          gustKph: weatherData.current.gust_kph,
        },
        forecast: weatherData.forecast.forecastday.map((day) => ({
          date: day.date,
          maxTempC: day.day.maxtemp_c,
          maxTempF: day.day.maxtemp_f,
          minTempC: day.day.mintemp_c,
          minTempF: day.day.mintemp_f,
          avgTempC: day.day.avgtemp_c,
          avgTempF: day.day.avgtemp_f,
          totalSnowCm: day.day.totalsnow_cm,
          chanceOfRain: day.day.daily_chance_of_rain,
          chanceOfSnow: day.day.daily_chance_of_snow,
        })),
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
