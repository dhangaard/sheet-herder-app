import styles from './OverviewPanel.module.css'
import Button from '../button/Button.jsx'
import ImagePlaceholder from '../imagePlaceholder/ImagePlaceholder.jsx'
import { useLocation,  useNavigate } from 'react-router'

export default function OverviewPanel({ heading, description, ctaLabel, ctaTo, reverse = false }) {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className={`${styles.panel} ${reverse ? styles.reverse : ''}`}>
            <div className={styles.content}>
                <h3>{heading}</h3>
                <p className={styles.description}>{description}</p>
                <Button onClick={() => navigate(ctaTo, { state: { from : location.pathname } })}>{ctaLabel}</Button>
            </div>
            <div className={styles.image}>
                <ImagePlaceholder />
            </div>
        </div>
    )
}