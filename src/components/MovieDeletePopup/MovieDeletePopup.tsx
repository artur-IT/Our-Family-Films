import styles from "./MovieDelete.module.css";

export const MovieDeletePopup = () => {
  return (
    <>
      <div className={styles.movieDeletePopup}>
        <p>Are you sure you want to delete this movie?</p>
        <div>
          <button>Yes</button>
          <button>No</button>
        </div>
      </div>
      ;
    </>
  );
};
