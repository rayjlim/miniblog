type EntryType = {
  id: number,
  content: string,
  date: string,
  highlighted?: string
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
  startDate: string,
  endDate: string,
  resultsLimit?: number
  searchParam: string,
  postsCount: number
}
