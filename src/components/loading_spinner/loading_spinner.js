import styles from "./loading_spinner.module.css";

export default function LoadingSpinner({ label = "Завантаження..." }) {
    return (
        <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            {label && <p>{label}</p>}
        </div>
    );
}
