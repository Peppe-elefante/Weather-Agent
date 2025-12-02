import { tool } from "ai";
import { z } from "zod";
import { WeatherResponse, Env } from "../types";
import { logger } from "../utils";

/**
 * Forecast tool - Gets weather data using coordinates
 * This should be called after geocodeTool to get the actual weather forecast
 */
export const forecastTool = (env: Env) =>
  tool({
    description:
      "Get current weather conditions and forecast for a location using its coordinates (latitude and longitude). Use this tool after getting coordinates from the geocode tool.",
    inputSchema: z.object({
      latitude: z.number().describe("The latitude coordinate of the location"),
      longitude: z
        .number()
        .describe("The longitude coordinate of the location"),
    }),
    execute: async ({ latitude, longitude }) => {
      try {
        const apiKey = env.WEATHER_API_KEY;
        if (!apiKey) {
          logger.error("Weather API key not found");
          throw new Error("Weather API key not configured");
        }

        // Use coordinates for weather lookup
        const coordString = `${latitude},${longitude}`;
        const weatherResponse = await fetch(
          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${coordString}&days=7&aqi=no&alerts=no`,
        );

        if (!weatherResponse.ok) {
          logger.error(`Weather API error: ${weatherResponse.status}`);
          throw new Error(
            `Failed to fetch weather data: ${weatherResponse.status}`,
          );
        }

        const weatherData = (await weatherResponse.json()) as WeatherResponse;

        logger.info(
          `Fetched weather for: ${weatherData.location.name}, ${weatherData.location.country}`,
        );
        // Return a simplified response to avoid exceeding model limits
        return {
          success: true,
          location: `${weatherData.location.name}, ${weatherData.location.country}`,
          localtime: weatherData.location.localtime,
          current: {
            temp_c: weatherData.current.temp_c,
            temp_f: weatherData.current.temp_f,
            condition: weatherData.current.condition?.text || "N/A",
            humidity: weatherData.current.humidity,
            precip_mm: weatherData.current.precip_mm,
            cloud: weatherData.current.cloud,
            wind_kph: weatherData.current.wind_kph || 0,
            wind_dir: weatherData.current.wind_dir || "N/A",
          },
          forecast: weatherData.forecast.forecastday.map((day) => ({
            date: day.date,
            max_c: day.day.maxtemp_c,
            min_c: day.day.mintemp_c,
            condition: day.day.condition?.text || "N/A",
            rain_chance: day.day.daily_chance_of_rain,
            snow_chance: day.day.daily_chance_of_snow,
          })),
        };
      } catch (error) {
        logger.error({ error }, "Weather forecast error");
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error occurred fetching weather",
        };
      }
    },
  });
