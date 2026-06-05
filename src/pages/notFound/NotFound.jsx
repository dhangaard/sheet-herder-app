import { useNavigate } from 'react-router'
import Button from '../../components/button/Button';
import styles from './NotFound.module.css'
 
export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.code}>404</h1>
            <h4 className={styles.message}>This page could not be found</h4>
            <Button variant="secondary" onClick={() => navigate('/')}>Go back</Button>
        </div>
    )
}
 