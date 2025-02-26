// Base types
interface BaseEntity {
  id: number;
}

// Entry related types
interface EntryType extends BaseEntity {
  content: string;
  date: string;
  highlighted?: string;
  locations?: string;
}

// Movie related types
interface MovieType extends BaseEntity {
  title: string;
  imdbImageId: string;
  imdbId: string;
}

// Media related types
interface MediaType {
  fileName: string;
  filePath: string;
  filesize: number;
  prepend: string;
  imgUrl: string;
}

// Search related types
interface SearchParamsType {
  startDate?: string;
  endDate?: string;
  resultsLimit?: number;
  text?: string;
}

// Error handling types
interface RequestError {
  message?: string;
}

// Authentication types
interface User {
  // Add specific user properties here
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Map related types
interface MarkerType {
  lat: number;
  lng: number;
  title?: string;
}

// Configuration types
interface SettingsType {
  TRACKS_API: string;
  TRACKS_URL: string;
  MOVIES_API: string;
  MOVIES_POSTERS: string;
  UPLOAD_ROOT: string;
  INSPIRATION_API: string;
  QUESTION_API: string;
  UPLOAD_SIZE_LIMIT: number;
  GOOGLE_API_KEY: string;
}

export type {
  EntryType,
  MovieType,
  MediaType,
  SearchParamsType,
  RequestError,
  User,
  AuthContextType,
  MarkerType,
  SettingsType
};
