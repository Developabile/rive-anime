import styles from "@/styles/Settings.module.scss";

const Disclaimer = () => {
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logo512.png"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="RiveKun"
        />
        <p>Your Personal Streaming Oasis</p>
      </div>
      <div className={styles.settings}>
        <h1>Disclaimer</h1>
        <div className={styles.group2}>
          <p>
            RiveKun does not host any files, it merely links to 3rd party
            services.
          </p>
          <p>
            Legal issues should be taken up with the file hosts and providers.
          </p>
          <p>
            RiveKun is not responsible for any media files shown by the video
            providers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
