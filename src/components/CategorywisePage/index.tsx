import { useState, useEffect } from "react";
import axiosFetch from "@/Utils/fetchBackend";
import styles from "./style.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Filter from "../Filter";
import Skeleton from "react-loading-skeleton";
import NProgress from "nprogress";
import { toast } from "sonner";
// import MoviePoster from '@/components/MoviePoster';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const CategorywisePage = ({ categoryDiv, categoryPage = null }: any) => {
  const [categoryType, setCategoryType] = useState(categoryDiv);
  const [category, setCategory] = useState("trending"); // latest, trending, topRated
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [filterGenreList, setFilterGenreList] = useState<any>("");
  const [filterYear, setFilterYear] = useState();
  const [sortBy, setSortBy] = useState<any>("");
  const [trigger, setTrigger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nextPagePresent, setNextPagePresent] = useState(false);
  const [season, setSeason] = useState();
  const [format, setFormat] = useState();
  const [animeStatus, setAnimeStatus] = useState();
  const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  console.log(capitalizeFirstLetter(categoryType));
  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else NProgress.done(false);
  }, [loading]);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      // setData([0, 0, 0, 0, 0, 0, 0, 0, 0]); // for blink loading effect
      try {
        let data;
        if (category === "filter") {
          data = await axiosFetch({
            requestID: `advancedSearch`,
            page: currentPage,
            season: season,
            format: format,
            animeStatus: animeStatus,
            genreKeywords: filterGenreList,
            year: filterYear,
            sortBy: sortBy,
          });
        } else {
          data = await axiosFetch({
            requestID: `${category}Anime`,
            page: currentPage,
          });
        }
        // console.log();
        // if (data.page > data?.total_pages) {
        //   setCurrentPage(data?.total_pages);
        // }
        // if (currentPage > data?.total_pages) {
        //   setCurrentPage(data.total_pages);
        //   return;
        // }
        setData(data?.results);
        setNextPagePresent(data?.hasNextPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    // setCurrentPage(1);
    fetchData();
  }, [categoryType, category, currentPage, trigger]);

  // useEffect(()=>{
  //   setCurrentPage(1);
  // },[category])

  const handleFilterClick = () => {
    setCurrentPage(1);
    setCategory("filter");
    setShowFilter(!showFilter);
  };
  return (
    <div className={styles.MoviePage}>
      <h1>Anime</h1>
      <div className={styles.category}>
        <p
          className={`${category === "trending" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("trending")}
        >
          Trending
        </p>
        <p
          className={`${category === "popular" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("popular")}
        >
          Popular
        </p>
        <p
          className={`${category === "recentEpisodes" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("recentEpisodes")}
        >
          Recently-Updated
        </p>
        <p
          className={`${category === "filter" ? styles.active : styles.inactive} ${styles.filter}`}
          onClick={handleFilterClick}
        >
          Filter{" "}
          {category === "filter" ? (
            <MdFilterAlt className={styles.active} />
          ) : (
            <MdFilterAltOff />
          )}
        </p>
      </div>
      {/* <Filter/> */}
      {showFilter && (
        <Filter
          categoryType={categoryType}
          setShowFilter={setShowFilter}
          setFilterYear={setFilterYear}
          setFilterGenreList={setFilterGenreList}
          filterGenreList={filterGenreList}
          filterYear={filterYear}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setCategory={setCategory}
          setTrigger={setTrigger}
          trigger={trigger}
          foramt={format}
          setFormat={setFormat}
          season={season}
          setSeason={setSeason}
          animeStatus={animeStatus}
          setAnimeStatus={setAnimeStatus}
        />
      )}
      <div className={styles.movieList}>
        {data?.map((ele: any) => {
          return <MovieCardSmall data={ele} media_type={categoryType} />;
        })}
        {data?.length === 0 && filterGenreList === "" ? (
          dummyList.map((ele) => <Skeleton className={styles.loading} />)
        ) : (
          <p>No data Found</p>
        )}
        {/* {data?.total_results === 0 &&
          <h1>No Data Found</h1>} */}
      </div>
      {/* <div className={styles.jumpTo}>
        <h3>Jump to</h3>
        <input
          type="number"
          className={styles.pageInput}
          value={currentPage}
          min={"1"}
          minLength={1}
          onChange={(e: any) => {
            // console.log({ val: e.target.value });
            if (e.target.value === "") setCurrentPage(e.target.value);
            else if (e.target.value === "0") {
              toast.error(`Page number should be greater than 0`);
            } else if (e.target.value <= totalPage)
              setCurrentPage(e.target.value);
            else {
              toast.error(
                `Page number should be less than Total pages: ${totalPage}`,
              );
            }
          }}
        />
      </div> */}
      <ReactPaginate
        containerClassName={styles.pagination}
        pageClassName={styles.page_item}
        activeClassName={styles.paginateActive}
        onPageChange={(event) => {
          setCurrentPage(event.selected + 1);
          console.log({ event });
          window.scrollTo(0, 0);
        }}
        forcePage={currentPage - 1}
        pageCount={nextPagePresent ? currentPage + 1 : currentPage}
        breakLabel=" ... "
        previousLabel={<AiFillLeftCircle className={styles.paginationIcons} />}
        nextLabel={<AiFillRightCircle className={styles.paginationIcons} />}
      />
      ;
    </div>
  );
};

export default CategorywisePage;
