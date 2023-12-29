type EntryType = {
  id: number,
  content: string,
  date: string,
  highlighted?: string,
  locations?: string
}

type MovieType = {
  id: number,
  title: string,
  imdbImageId: string,
  imdbId: string,
};

type MediaType = {
  fileName: string,
  filePath: string,
  prepend: string,
  imgUrl: string,
}

type SearchParamsType = {
  startDate?: string,
  endDate?: string,
  resultsLimit?: number
  text?: string,
}

type RequestError = {
  message?: string;
}

type AuthContextType = {
  user: any,
  login: (username: string, password: string) => void,
  logout: () => void
}

type MarkerType = {
  lat: number,
  lng: number,
  title?: string
}

type SettingsType = {
  TRACKS_API: string,
  MOVIES_API: string,
  MOVIES_POSTERS: string,
  UPLOAD_ROOT: string,
  INSPIRATION_API: string,
  QUESTION_API: string,
  UPLOAD_SIZE_LIMIT: number,
  GOOGLE_API_KEY: string
}
