import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";
import Player from "@/components/Artplayer";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  // console.log(params.get("id"));
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [seasondata, setseasonData] = useState<any>();
  const [source, setSource] = useState("PRO");
  const [embedMode, setEmbedMode] = useState<any>();
  // const [nonEmbedURL, setNonEmbedURL] = useState<any>("");
  const [nonEmbedSourcesIndex, setNonEmbedSourcesIndex] = useState<any>("");
  const [nonEmbedSources, setNonEmbedSources] = useState<any>("");
  const [nonEmbedCaptions, setnonEmbedCaptions] = useState<any>([]);
  const [nonEmbedVideoProviders, setNonEmbedVideoProviders] = useState([]);
  const [nonEmbedSourcesNotFound, setNonEmbedSourcesNotFound] =
    useState<any>(false);
  // const [nonEmbedFormat, setnonEmbedFormat] = useState<any>();
  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);
  if (type === null && params.get("id") !== null) setType(params.get("type"));
  if (id === null && params.get("id") !== null) setId(params.get("id"));
  if (season === null && params.get("season") !== null)
    setSeason(params.get("season"));
  if (episode === null && params.get("episode") !== null)
    setEpisode(params.get("episode"));

  useEffect(() => {
    if (
      localStorage.getItem("RiveStreamEmbedMode") !== undefined &&
      localStorage.getItem("RiveStreamEmbedMode") !== null
    )
      setEmbedMode(
        JSON.parse(localStorage.getItem("RiveStreamEmbedMode") || "false"),
      );
    else setEmbedMode(false);
    const latestAgg: any = localStorage.getItem("RiveStreamLatestAgg");
    if (latestAgg !== null && latestAgg !== undefined) setSource(latestAgg);
    setLoading(true);
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));
    setContinueWatching({ type: params.get("type"), id: params.get("id") });
  }, [params, id, season, episode]);

  useEffect(() => {
    if (embedMode !== undefined && embedMode !== null)
      localStorage.setItem("RiveStreamEmbedMode", embedMode);
    if (embedMode === true) {
      const latestAgg: any = localStorage.getItem("RiveStreamLatestAgg");
      if (latestAgg !== null && latestAgg !== undefined) setSource(latestAgg);
      toast.info(
        <div>
          Cloud: use AD-Blocker services for AD-free experience, like AD-Blocker
          extension or{" "}
          <a target="_blank" href="https://brave.com/">
            Brave Browser{" "}
          </a>
        </div>,
      );

      toast.info(
        <div>
          Cloud: use video downloader extensions like{" "}
          <a target="_blank" href="https://fetchv.net/">
            FetchV{" "}
          </a>{" "}
          or{" "}
          <a target="_blank" href="https://www.hlsloader.com/">
            Stream Recorder{" "}
          </a>{" "}
          for PC and{" "}
          <a
            target="_blank"
            href="https://play.google.com/store/apps/details?id=videoplayer.videodownloader.downloader"
          >
            AVDP{" "}
          </a>{" "}
          for Android, to download movies/tv shows. Refer{" "}
          <a
            target="_blank"
            href="https://www.reddit.com/r/DataHoarder/comments/qgne3i/how_to_download_videos_from_vidsrcme/"
          >
            The Source{" "}
          </a>
        </div>,
      );
    }
    // window.addEventListener("keydown", (event) => {
    //   console.log("Key pressed:", event.key);
    // });
  }, [embedMode]);

  useEffect(() => {
    let autoEmbedMode: NodeJS.Timeout;
    if (embedMode === false && id !== undefined && id !== null) {
      const fetch = async () => {
        setNonEmbedSourcesNotFound(false);
        const providers: any = await axiosFetch({
          requestID: `episodeStreamingLinks`,
          id: id,
        });
        console.log({ providers });
        providers?.sources?.map((ele: any) => {
          return {
            ...ele,
            format: ele?.isM3U8 ? "hls" : "mp4",
          };
        });
        const res = providers;
        console.log({ res });
        if (res?.sources?.length > 0) {
          setNonEmbedSources(res?.sources);
          res?.sources?.length > 0 ? setNonEmbedSourcesIndex(0) : null;
          setnonEmbedCaptions(res?.captions);
          clearTimeout(autoEmbedMode);
          setNonEmbedSourcesNotFound(false);
        } else {
          setNonEmbedSourcesNotFound(true);
          autoEmbedMode = setTimeout(() => {
            setEmbedMode(true);
          }, 10000);
        }
      };

      fetch();
      // if (nonEmbedURl === "") setEmbedMode(true);
    }
  }, [params, id, season, episode, embedMode]);

  function handleBackward() {
    // setEpisode(parseInt(episode)+1);
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    // setEpisode(parseInt(episode)+1);
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  const STREAM_URL_PRO = process.env.NEXT_PUBLIC_STREAM_URL_PRO;

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="go back"
        />
      </div>
      {
        <div className={styles.episodeControl}>
          <div
            ref={moreBtn}
            onClick={() => setWatchDetails(!watchDetails)}
            data-tooltip-id="tooltip"
            data-tooltip-html={
              !watchDetails
                ? "More <span class='tooltip-btn'>SHIFT + M</span></div>"
                : "close <span class='tooltip-btn'>SHIFT + M</span></div>"
            }
          >
            {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
          </div>
        </div>
      }
      {watchDetails && (
        <WatchDetails
          id={id}
          type={type}
          data={data}
          season={season}
          episode={episode}
          setWatchDetails={setWatchDetails}
        />
      )}
      <div className={styles.watchSelects}>
        {embedMode === true && (
          <select
            name="source"
            id="source"
            aria-placeholder="servers"
            className={styles.source}
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              localStorage.setItem("RiveStreamLatestAgg", e.target.value);
            }}
          >
            <option value="PRO" defaultChecked>
              Aggregator : 1 (Best-Server)
            </option>
          </select>
        )}

        {embedMode === false && (
          <select
            name="embedModesource"
            id="embedModesource"
            className={styles.embedMode}
            value={nonEmbedSourcesIndex}
            onChange={(e) => {
              setNonEmbedSourcesIndex(e.target.value);
            }}
            aria-placeholder="servers"
          >
            <option value="" disabled selected>
              servers
            </option>
            {nonEmbedSources?.length > 0 &&
              nonEmbedSources?.map((ele: any, ind: any) => {
                if (typeof ele === "object" && ele !== null) {
                  return (
                    <option value={ind} defaultChecked>
                      {ele?.source} ({ele?.quality})
                    </option>
                  );
                }
              })}
          </select>
        )}
        <select
          name="embedMode"
          id="embedMode"
          className={styles.embedMode}
          value={embedMode}
          onChange={(e) => {
            setEmbedMode(JSON.parse(e.target.value));
            localStorage.setItem("RiveStreamEmbedMode", e.target.value);
          }}
        >
          <option value="true">Embed Mode</option>
          <option value="false">NON Embed Mode (AD-free)</option>
        </select>
      </div>
      <div className={`${styles.loader} skeleton`}>
        {embedMode === false && id !== undefined && id !== null ? (
          <div className={styles.videoProviders}>
            {nonEmbedVideoProviders?.map((ele: any) => {
              return (
                <div
                  className={`${styles.videoProvider} ${ele?.status === "available" ? styles.available : null} ${ele?.status === "fetching" ? styles.fetching : null} ${ele?.status === "success" ? styles.success : null} ${ele?.status === "error" ? styles.error : null}`}
                >
                  <div className={`${styles.videoProviderName}`}>
                    {ele?.name?.toUpperCase()}
                  </div>
                  <div className={`${styles.videoProviderStatus} `}>
                    {ele?.status}
                  </div>
                </div>
              );
            })}
            {nonEmbedSourcesNotFound ? (
              <p className={`${styles.para2} ${styles.success}`}>
                Server not found. Automatically switching to Embed Mode.
              </p>
            ) : (
              <p className={styles.para}>
                If Server not found, Then system will automatically switch to
                Embed Mode in 10 seconds
              </p>
            )}
          </div>
        ) : (
          <div className={`${styles.loader}`}>
            <div className={`${styles.scanner}`}>
              <span>Loading..</span>
            </div>
          </div>
        )}
      </div>
      {embedMode === false && nonEmbedSourcesIndex !== "" && (
        <Player
          option={{
            url: nonEmbedSources[nonEmbedSourcesIndex]?.url,
          }}
          format={nonEmbedSources[nonEmbedSourcesIndex]?.isM3U8 ? "hls" : "mp4"}
          captions={nonEmbedCaptions}
          className={styles.videoPlayer}
        />
      )}

      {source === "PRO" && id !== "" && id !== null && embedMode === true ? (
        <iframe
          scrolling="no"
          src={
            type === "movie"
              ? `${STREAM_URL_PRO}/embed/anilist/${season}?audio=sub&autoplay=0&theme=F52E8E`
              : `${STREAM_URL_PRO}/embed/anilist/${season}/${episode}?audio=sub&autoplay=0&theme=F52E8E`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}
    </div>
  );
};

export default Watch;
