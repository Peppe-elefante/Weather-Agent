import { tool } from "ai";
import { z } from "zod";
import { GeocodingResponse, Env } from "../types";
import { logger } from "../utils";

/**
 * Geocode tool - Converts a location name into coordinates
 * This is the first step in the weather lookup process
 */
export const geocodeTool = (env: Env) =>
  tool({
    description:
      "Convert a location name (city, address, or place name) into geographic coordinates (latitude and longitude). Use this tool first to get coordinates before fetching weather data.",
    inputSchema: z.object({
      location: z
        .string()
        .describe(
          "The location name to geocode (e.g., 'New York', 'London', 'Tokyo', 'Paris, France')",
        ),
    }),
    execute: async ({ location }) => {
      try {
        const apiKey = env.WEATHER_API_KEY;
        if (!apiKey) {
          logger.error("Weather API key not found");
          throw new Error("Weather API key not configured");
        }

        // Use WeatherAPI's search endpoint for geocoding
        const geocodeResponse = await fetch(
          `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(location)}`,
        );

        if (!geocodeResponse.ok) {
          logger.error(`Geocoding API error: ${geocodeResponse.status}`);
          throw new Error(
            `Failed to geocode location: ${geocodeResponse.status}`,
          );
        }

        const geocodeData = (await geocodeResponse.json()) as GeocodingResponse;

        if (!geocodeData || geocodeData.length === 0) {
          return {
            success: false,
            error: `Location "${location}" not found. Please check the spelling or try a different location.`,
          };
        }

        // Return the first (best) match
        const firstResult = geocodeData[0];

        logger.info(
          `Geocoded "${location}" to: ${firstResult.name}, ${firstResult.country}`,
        );

        return {
          success: true,
          location: firstResult.name,
          region: firstResult.region,
          country: firstResult.country,
          latitude: firstResult.lat,
          longitude: firstResult.lon,
          url: firstResult.url,
        };
      } catch (error) {
        logger.error({ error }, "Geocoding error");
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown error occurred during geocoding",
        };
      }
    },
  });
