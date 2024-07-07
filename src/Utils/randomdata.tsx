import axiosFetch from "./fetchBackend";
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const fetchRandom = async () => {
  const randomNumber = Math.floor(Math.random() * 100);
  const page = randomNumber;
  const types = ["movie", "tv"];
  const type = types[randomNumber % 2];
  const index = randomNumber % 20;
  console.log({ randomNumber });
  try {
    const res = await axiosFetch({
      requestID: `advancedSearch`,
      page: page,
      sortBy: "POPULARITY_DESC",
    });
    return {
      type:
        res?.results[index % res?.results?.length]?.type?.toLowerCase() ===
        "movie"
          ? "movie"
          : "tv",
      id: res?.results[index % res?.results?.length]?.id,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
