import { useNavigate } from 'react-router'
import Button from '../button/Button'
import styles from './UnderConstruction.module.css'

export default function UnderConstruction({ pageTitle }) {
    const navigate = useNavigate();
    
    return (
        <div className={styles.wrapper}>
            <h1>Under Construction</h1>
            <h5>
                {pageTitle
                    ? `Return again soon to experience the new ${pageTitle}!`
                    : 'Return again soon to find more exciting content!'}
            </h5>
            <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
        </div>
    )
}