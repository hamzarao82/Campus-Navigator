export interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface POI {
  id: string | number;
  name: string;
  description?: string;
  category?: string;
  latitude: number;
  longitude: number;
  location?: string;
  savedAt?: string;
  type?: string;
}

export interface RouteData {
  coordinates: { latitude: number; longitude: number }[];
  distance: string;
  duration: number;
  steps: any[];
}

export interface SearchResult {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  type?: string;
}

export interface LongPressCoords {
  latitude: number;
  longitude: number;
}
