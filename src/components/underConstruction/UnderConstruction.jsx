import { Link } from 'react-router'
import styles from './UnderConstruction.module.css'

export default function UnderConstruction({ pageTitle }) {
    return (
        <div className={styles.wrapper}>
            <h1>Under Construction</h1>
            <h5>
                {pageTitle
                    ? `Return again soon to experience the new ${pageTitle}!`
                    : 'Return again soon to find more exciting content!'}
            </h5>
            <Link to="/">Go back</Link>
        </div>
    )
}