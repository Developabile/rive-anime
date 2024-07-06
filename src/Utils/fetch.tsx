import axios from "axios";

interface Fetch {
  requestID: any;
  id?: string | null;
  provider?: string | null;
  page?: number;
  perPage?: number;
  genreKeywords?: string;
  sortBy?: string;
  query?: string;
  season?: any;
  format?: string;
  year?: string;
  animeStatus?: string;
}
export default async function axiosFetch({
  requestID,
  id,
  provider = "gogoanime",
  page = 1,
  perPage = 20,
  genreKeywords,
  sortBy,
  query,
  season,
  format,
  year,
  animeStatus,
}: Fetch) {
  const request = requestID;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseURL = process.env.NEXT_PUBLIC_ANILIST_API;
  const randomURL = process.env.NEXT_PUBLIC_RANDOM_URL;
  const ProviderURL = process.env.NEXT_PUBLIC_PROVIDER_URL;
  const ExternalProviderURL = process.env.NEXT_PUBLIC_EXTERNAL_PROVIDER_URL;
  const requests: any = {
    trendingAnime: `${baseURL}/meta/anilist/trending?page=${page}&perPage=${perPage}`,
    popularAnime: `${baseURL}/meta/anilist/popular?page=${page}&perPage=${perPage}`,
    randomAnime: `${baseURL}/meta/anilist/random-anime`,

    airingSchedule: `${baseURL}/meta/anilist/airing-schedule`,

    infoAnime: `${baseURL}/meta/anilist/info/${id}?provider=${provider}`,
    recentEpisodesAnime: `${baseURL}/meta/anilist/recent-episodes?page=${page}&perPage=${perPage}&provider=${provider}`,

    episodeStreamingLinks: `${baseURL}/meta/anilist/watch/${id}`,

    search: `${baseURL}/meta/anilist/${query}?page=${page}`,
    advancedSearch: `${baseURL}/meta/anilist/advanced-search?&page=${page}&perPage=${perPage}${query != undefined ? "&query=" + query : ""}${season != undefined ? "&season=" + season : ""}${format != undefined ? "&format=" + format : ""}${sortBy != undefined ? "&sort=" + sortBy : ""}${genreKeywords != undefined ? "&genres=" + genreKeywords : ""}${id != undefined ? "&id=" + id : ""}${year != undefined ? "&year=" + year : ""}${animeStatus != undefined ? "&status=" + animeStatus : ""}`,
  };
  const final_request = requests[request];
  // console.log({ final_request });

  try {
    const response = await axios.get(final_request, {
      params: { api_key: API_KEY },
    });
    return await response?.data; // Return the resolved data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle errors appropriately (e.g., throw a custom error or return null)
    // throw new Error("Failed to fetch data"); // Example error handling
  }
}
