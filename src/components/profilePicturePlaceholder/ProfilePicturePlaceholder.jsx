import ProfileIcon from '../../assets/icons/profile-picture-placeholder.svg?react'
import styles from './ProfilePicturePlaceholder.module.css'

export default function ProfilePicturePlaceholder() {
    return (
        <div className={styles.container}>
            <ProfileIcon className={styles.icon} />
        </div>
    );
}