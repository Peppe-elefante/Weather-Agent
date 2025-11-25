export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
}
