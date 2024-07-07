import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import Skeleton from "react-loading-skeleton";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const genreData = [
  "Action",
  "Adventure",
  "Cars",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];
const SortData = [
  { name: "Popularity &darr; ", val: "POPULARITY_DESC" },
  { name: "Popularity &uarr;", val: "POPULARITY" },
  { name: "Trending &darr;", val: "TRENDING_DESC" },
  { name: "Trending &uarr;", val: "TRENDING" },
  { name: "Updated At &darr;", val: "UPDATED_AT_DESC" },
  { name: "Updated At &uarr;", val: "UPDATED_AT" },
  { name: "Start Date &darr;", val: "START_DATE_DESC" },
  { name: "Start Date &uarr;", val: "START_DATE" },
  { name: "End Date &darr;", val: "END_DATE_DESC" },
  { name: "End Date &uarr;", val: "END_DATE" },
  { name: "Favourites &darr;", val: "FAVOURITES_DESC" },
  { name: "Favourites &uarr;", val: "FAVOURITES" },
  { name: "Rating &darr;", val: "SCORE_DESC" },
  { name: "Rating &uarr;", val: "SCORE" },
  { name: "Title Romaji &darr;", val: "TITLE_ROMAJI_DESC" },
  { name: "Title Romaji &uarr;", val: "TITLE_ROMAJI" },
  { name: "Title English &darr;", val: "TITLE_ENGLISH_DESC" },
  { name: "Title English &uarr;", val: "TITLE_ENGLISH" },
  { name: "Title Native &darr;", val: "TITLE_NATIVE_DESC" },
  { name: "Title Native &uarr;", val: "TITLE_NATIVE" },
  { name: "Episodes &darr;", val: "EPISODES_DESC" },
  { name: "Episodes &uarr;", val: "EPISODES" },
  { name: "ID &darr;", val: "ID_DESC" },
  { name: "ID &uarr;", val: "ID" },
];
const seasonData = [
  { name: "Winter", val: "WINTER" },
  { name: "Spring", val: "SPRING" },
  { name: "Summer", val: "SUMMER" },
  { name: "Fall", val: "FALL" },
];
const formatData = [
  { name: "Tv", val: "TV" },
  { name: "Movie", val: "MOVIE" },
  { name: "Tv Short", val: "TV_SHORT" },
  { name: "OVA", val: "OVA" },
  { name: "ONA", val: "ONA" },
  { name: "Special", val: "SPECIAL" },
  { name: "Music", val: "MUSIC" },
];
const statusData = [
  { name: "Releasing", val: "RELEASING" },
  { name: "Not Yet Released", val: "NOT_YET_RELEASED" },
  { name: "Finished", val: "FINISHED" },
  { name: "Cancelled", val: "CANCELLED" },
  { name: "Haitus", val: "HIATUS" },
];
const Filter = ({
  categoryType,
  setShowFilter,
  setFilterYear,
  setFilterGenreList,
  filterGenreList,
  filterYear,
  sortBy,
  setSortBy,
  setCategory,
  setTrigger,
  trigger,
  foramt,
  setFormat,
  season,
  setSeason,
  animeStatus,
  setAnimeStatus,
}: any) => {
  const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  // const [genreData, setGenreData] = useState([]);
  const [selectedSeasonCheckbox, setSelectedSeasonCheckbox] = useState(season);
  const [selectedFormatCheckbox, setSelectedFormatCheckbox] = useState(foramt);
  const [selectedStatusCheckbox, setSelectedStatusCheckbox] =
    useState(animeStatus);
  // const [countryData, setCountryData] = useState([]);
  const [yearData, setYearData] = useState();
  // useEffect(() => {
  //   setSelectedCountryCheckbox(filterCountry);
  // }, []);
  const handleGenereSelect = (id: any) => {
    console.log({ id });
    setFilterGenreList(
      filterGenreList === "" ? id + "," : filterGenreList + id + ",",
    );
    // console.log({ filterGenreList });
  };
  const handleSortSelect = (id: any) => {
    console.log({ id });
    setSortBy(sortBy === "" ? id + "," : sortBy + id + ",");
    // console.log({ filterGenreList });
  };

  const handleSeasonSelect = (name: any) => {
    console.log({ name });
    setSeason(name);
    setSelectedSeasonCheckbox(name);
    // console.log({ filterGenreList });
  };
  const handleFormatSelect = (name: any) => {
    console.log({ name });
    setFormat(name);
    setSelectedFormatCheckbox(name);
    // console.log({ filterGenreList });
  };
  const handleStatusSelect = (name: any) => {
    console.log({ name });
    setAnimeStatus(name);
    setSelectedStatusCheckbox(name);
    // console.log({ filterGenreList });
  };
  const handleFilterSubmit = () => {
    setCategory("filter");
    setTrigger(!trigger);
    setShowFilter(false);
    console.log({ filterGenreList });
  };
  const handleFilterReset = () => {
    setFilterGenreList("");
    setFilterYear(undefined);
    setFormat(undefined);
    setSortBy("");
    setAnimeStatus(undefined);
    setSeason(undefined);
    setSelectedSeasonCheckbox(undefined);
    setSelectedFormatCheckbox(undefined);
    setSelectedStatusCheckbox(undefined);
  };

  return (
    <div className={styles.Filter}>
      <h1>Filter</h1>
      <h1
        className={styles.close}
        onClick={() => {
          setShowFilter(false);
        }}
      >
        x
      </h1>

      <h2>Genres</h2>
      {genreData.map((ele: any) => {
        const selectedGenres =
          typeof filterGenreList === "string" ? filterGenreList.split(",") : [];
        const isChecked = selectedGenres.includes(ele);
        return (
          <div
            className={`${styles.checkboxDiv} ${isChecked ? styles.active : styles.inactive}`}
          >
            <label className={"container"} htmlFor={ele}>
              {ele}
              <input
                type="checkbox"
                id={ele}
                name={ele}
                value={ele}
                onChange={() => handleGenereSelect(ele)}
                checked={isChecked}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}
      {genreData?.length === 0 && (
        <Skeleton count={7} style={{ margin: "0.2rem 0", padding: "0.5rem" }} />
      )}

      <h2>Sort By</h2>
      {SortData.map((ele: any) => {
        const selectedGenres =
          typeof sortBy === "string" ? sortBy.split(",") : [];
        const isChecked = selectedGenres.includes(ele?.val);
        return (
          <div
            className={`${styles.checkboxDiv} ${isChecked ? styles.active : styles.inactive}`}
          >
            <label className={"container"} htmlFor={ele?.name}>
              <span dangerouslySetInnerHTML={{ __html: ele?.name }} />
              <input
                type="checkbox"
                id={ele?.name}
                name={ele?.name}
                value={ele?.name}
                onChange={() => handleSortSelect(ele?.val)}
                checked={isChecked}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}
      {genreData?.length === 0 && (
        <Skeleton count={7} style={{ margin: "0.2rem 0", padding: "0.5rem" }} />
      )}
      <h2>Season</h2>
      {seasonData.map((ele: any) => {
        return (
          <div
            className={`${styles.checkboxDiv} ${selectedSeasonCheckbox === ele.val ? styles.active : styles.inactive}`}
          >
            <label className={"container"} htmlFor={ele?.name}>
              {ele?.name}
              <input
                type="checkbox"
                id={ele?.name}
                name={ele?.name}
                value={ele?.val}
                onChange={() => handleSeasonSelect(ele?.val)}
                checked={selectedSeasonCheckbox === ele?.val}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}
      <h2>Format</h2>
      {formatData.map((ele: any) => {
        return (
          <div
            className={`${styles.checkboxDiv} ${selectedFormatCheckbox === ele.val ? styles.active : styles.inactive}`}
          >
            <label className={"container"} htmlFor={ele?.val}>
              {ele?.name}
              <input
                type="checkbox"
                id={ele?.val}
                name={ele?.val}
                value={ele?.val}
                onChange={() => handleFormatSelect(ele?.val)}
                checked={selectedFormatCheckbox === ele?.val}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}
      <h2>Status</h2>
      {statusData.map((ele: any) => {
        return (
          <div
            className={`${styles.checkboxDiv} ${selectedStatusCheckbox === ele.val ? styles.active : styles.inactive}`}
          >
            <label className={"container"} htmlFor={ele?.val}>
              {ele?.name}
              <input
                type="checkbox"
                id={ele?.val}
                name={ele?.val}
                value={ele?.val}
                onChange={() => handleStatusSelect(ele?.val)}
                checked={selectedStatusCheckbox === ele?.val}
              />
              <span className={"checkmark"}></span>
            </label>
          </div>
        );
      })}
      <h2>year</h2>
      <input
        type="text"
        id="input"
        name="input"
        value={filterYear}
        onChange={(e: any) => {
          setFilterYear(e.target.value);
        }}
        placeholder="Enter Year"
      />

      <div className={styles.filterButtons}>
        <div className={styles.filterSubmit} onClick={handleFilterSubmit}>
          submit
        </div>
        <div className={styles.filterSubmit} onClick={handleFilterReset}>
          reset
        </div>
      </div>
    </div>
  );
};

export default Filter;
