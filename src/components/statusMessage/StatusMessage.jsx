import styles from './StatusMessage.module.css'

export default function StatusMessage({ status }) {
    if (!status) {
        return null;
    }

    return (
        <div className={`${styles.statusMessage} ${styles[status.type]}`}>
            <div className={styles.accent} />
            <p>{status.message}</p>
        </div>
    )
}