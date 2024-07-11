import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/styles/Detail.module.scss";
import MetaDetails from "@/components/MetaDetails";
import Carousel from "@/components/Carousel";
import axiosFetch from "@/Utils/fetchBackend";
import MoviePoster from "@/components/MoviePoster";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import {
  BsBookmarkPlus,
  BsFillBookmarkCheckFill,
  BsShare,
} from "react-icons/bs";
import { FaPlay, FaYoutube } from "react-icons/fa";
import {
  setBookmarks,
  checkBookmarks,
  removeBookmarks,
} from "@/Utils/bookmark";
import { navigatorShare } from "@/Utils/share";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { toast } from "sonner";

const DetailPage = () => {
  const params = useSearchParams();
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<string | null>("");
  const [season, setSeason] = useState<string | null>();
  const [episode, setEpisode] = useState<string | null>();
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [data, setData] = useState<any>({});
  const [bookmarked, setBookmarked] = useState(false);
  const [trailer, setTrailer] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    setLoading(true);
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));
    const fetchData = async () => {
      try {
        const data = await axiosFetch({ requestID: `infoAnime`, id: id });
        setData(data);
        if (typeof data === "string") {
          toast.info(
            <div>
              Data Load Failed due to very large data size. Change provider from
              settings
            </div>,
          );
        }
        console.log({ data });
        // const Videos = await axiosFetch({ requestID: `${type}Videos`, id: id });
        setTrailer(data?.trailer);
        // const response = await axiosFetch({
        //   requestID: `${type}Images`,
        //   id: id,
        // });
        // setImages(response.results);
        let arr: any = [];
        console.log(data?.artwork);

        data?.artwork !== undefined
          ? data?.artwork?.map((ele: any, i: number) => {
              if (
                arr?.length < 20 &&
                ele?.type == "poster" &&
                !ele?.img?.includes("medium") &&
                !ele?.img?.includes("small")
              )
                arr.push(ele?.img);
              else return;
            })
          : data?.characters?.map((ele: any, i: number) => {
              if (
                arr?.length < 20 &&
                !ele?.image?.includes("medium") &&
                !ele?.image?.includes("small")
              )
                arr.push(ele?.image);
              else return;
            });
        console.log(arr);

        // if (arr.length === 0) {
        //   response.posters.map((ele: any, i) => {
        //     if (i < 10) arr.push(process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele.file_path);
        //   });
        // }
        if (arr.length === 0) arr.push("/images/logo512.png");
        setImages(arr);
        // setLoading(false);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
      // finally {
      //   const data = await axiosFetch({ requestID: `${type}Data`, id: id });
      //   setData(data);
      // }
    };
    if (id !== undefined && id != "" && id != null) fetchData();
  }, [params, id]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
        // setIds(await getBookmarks(userID)?.movie)
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (data !== undefined && data !== null) {
        if (user !== undefined && user !== null)
          setBookmarked(
            await checkBookmarks({
              userId: user,
              type: data?.type?.toLowerCase() === "movie" ? "movie" : "tv",
              id: data.id,
            }),
          );
        else
          setBookmarked(
            await checkBookmarks({
              userId: null,
              type: data?.type?.toLowerCase() === "movie" ? "movie" : "tv",
              id: data.id,
            }),
          );
        // console.log(checkBookmarks({ userId: user, type: type, id: data.id }));
      }
    };
    fetch();
  }, [index, data, user]);

  const handleBookmarkAdd = () => {
    setBookmarks({
      userId: user,
      type: data?.type?.toLowerCase() === "movie" ? "movie" : "tv",
      id: data.id,
    });
    setBookmarked(!bookmarked);
  };
  const handleBookmarkRemove = () => {
    removeBookmarks({
      userId: user,
      type: data?.type?.toLowerCase() === "movie" ? "movie" : "tv",
      id: data.id,
    });
    setBookmarked(!bookmarked);
  };
  const handleShare = () => {
    const url = `/detail?type=${data?.type?.toLowerCase()}&id=${data?.id}`;
    navigatorShare({
      text:
        data.title?.english || data.title?.userPreferred || data.title?.romaji,
      url: url,
    });
  };

  return (
    // carousel
    // detail
    <div className={styles.DetailPage}>
      <div className={styles.biggerPic}>
        {
          images?.length > 0 ? (
            <Carousel
              imageArr={images}
              setIndex={setIndex}
              mobileHeight="60vh"
              desktopHeight="95vh"
              objectFit={"contain"}
              trailer={trailer?.id}
            />
          ) : (
            <Skeleton className={styles.CarouselLoading} />
          ) // if no images array, then use backdrop poster
        }
        <div className={styles.curvy}></div>
        <div className={styles.curvy2}></div>
        <div className={styles.DetailBanner}>
          <div className={styles.poster}>
            <div className={styles.curvy3}></div>
            <div className={styles.curvy4}></div>
            <div
              className={styles.rating}
              data-tooltip-id="tooltip"
              data-tooltip-content="Rating"
            >
              {data?.vote_average?.toFixed(0) || data?.rating?.toFixed(0)}%
            </div>
            <MoviePoster data={data} />
          </div>
          <div className={styles.HomeHeroMeta}>
            <h1
              data-tooltip-id="tooltip"
              data-tooltip-content={
                data?.title?.english ||
                data?.title?.userPreferred ||
                data?.title?.romaji ||
                "name"
              }
            >
              {data?.title?.english ||
                data?.title?.userPreferred ||
                data?.title?.romaji || <Skeleton />}
            </h1>
            <div className={styles.HomeHeroMetaRow2}>
              <p className={styles.type}>
                {data ? (type == "movie" ? "MOVIE" : "SHOW") : null}
              </p>
              {data ? (
                <>
                  {data?.episodes?.length > 0 ? (
                    <Link
                      className={styles.links}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Watch Online"
                      href={`${`${data?.episodes?.length > 0 && `/watch?type=${data?.type?.toLowerCase() === "movie" ? "movie" : "tv"}&id=${data?.episodes[0]?.id}&season=${id}&episode=${data?.episodes[0]?.number}`}`}`}
                    >
                      watch <FaPlay className={styles.IconsMobileNone} />
                    </Link>
                  ) : (
                    <Link
                      className={styles.links}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Watch Online"
                      href={`#`}
                    >
                      No Watch
                    </Link>
                  )}
                  {trailer && (
                    <Link
                      className={styles.links}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Watch Trailer"
                      href={`https://youtube.com/watch?v=${trailer?.id}`}
                      target="_blank"
                    >
                      trailer <FaYoutube className={styles.IconsMobileNone} />
                    </Link>
                  )}
                  {bookmarked ? (
                    <BsFillBookmarkCheckFill
                      className={styles.HomeHeroIcons}
                      onClick={handleBookmarkRemove}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Remove from Watchlist"
                    />
                  ) : (
                    <BsBookmarkPlus
                      className={styles.HomeHeroIcons}
                      onClick={handleBookmarkAdd}
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Add to Watchlist"
                    />
                  )}
                  <BsShare
                    className={styles.HomeHeroIcons}
                    onClick={handleShare}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Share"
                  />
                </>
              ) : (
                <div>
                  <Skeleton width={200} count={1} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.biggerDetail}>
        <MetaDetails id={id} type={type} data={data} />
      </div>
    </div>
  );
};

export default DetailPage;
