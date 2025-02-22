import styles from "./MovieDelete.module.css";

export const MovieDeletePopup = (props: { delete: () => void; deletePopup: () => void }) => {
  return (
    <>
      <div className={styles.movieDeletePopup}>
        <p>Are you sure you want to delete this movie?</p>
        <div>
          <button onClick={props.delete}>Yes</button>
          <button onClick={props.deletePopup}>No</button>
        </div>
      </div>
      ;
    </>
  );
};
