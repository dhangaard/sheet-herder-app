import { Link } from 'react-router'
import styles from './NotFound.module.css'
 
export default function NotFound() {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.code}>404</h1>
            <h4 className={styles.message}>This page could not be found</h4>
            <Link to="/">Go back</Link>
        </div>
    )
}
 