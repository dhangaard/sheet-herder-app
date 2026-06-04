import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router'
import { useAuth, useAuthActions } from '../../../context/auth/useAuth.js'
import { getCurrentUser, updateUser, deleteUser } from '../../../services/userService'
import { verifyPassword } from '../../../services/authService'
import { validateEmail, validateUsername, validatePassword, validatePasswordMatch } from '../../../utils/validator.js'
import FormCard from '../../../components/formCard/FormCard.jsx'
import Field from '../../../components/field/Field.jsx'
import Button from '../../../components/button/Button.jsx'
import StatusMessage from '../../../components/statusMessage/StatusMessage.jsx'
import styles from './Account.module.css'

export default function Account() {
    const { currentUser } = useAuth();
    const { logout, login } = useAuthActions();
    const navigate = useNavigate();

    const [original, setOriginal] = useState(null);
    const [loading, setLoading] = useState(true);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const [emailError, setEmailError] = useState(null);
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmError, setConfirmError] = useState(null);

    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser(currentUser.id);
                setEmail(user.email);
                setUsername(user.username);
                setOriginal(user);
            } catch (error) {
                setStatus({ type: 'error', message: error.message });
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [currentUser.id]);

    if (loading) {
        return (
            <div className={styles.page}>
                <p>Loading account…</p>
            </div>
        );
    }

    if (!original) {
        return (
            <div className={styles.page}>
                <StatusMessage type="error" message={status?.message || 'Could not load your account'} />
            </div>
        );
    }

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const emailChanged = trimmedEmail !== '' && trimmedEmail !== original.email;
    const usernameChanged = trimmedUsername !== '' && trimmedUsername !== original.username;
    const passwordChanged = newPassword.length > 0;
    const hasChanges = emailChanged || usernameChanged || passwordChanged;

    const emailValid = trimmedEmail === '' || validateEmail(email) === null;
    const usernameValid = trimmedUsername === '' || validateUsername(username) === null;
    const passwordValid = !passwordChanged || (validatePassword(newPassword) === null && validatePasswordMatch(newPassword, confirmNewPassword) === null);

    const canSubmit = hasChanges && emailValid && usernameValid && passwordValid && currentPassword.length > 0;

    function handleFieldChange(setter) {
        return function (event) {
            setter(event.target.value);
            setStatus(null);
        };
    }

    function clearPasswords() {
        setNewPassword('');
        setConfirmNewPassword('');
        setCurrentPassword('');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus(null);

        const payload = {
            ...(emailChanged && { email: trimmedEmail }),
            ...(usernameChanged && { username: trimmedUsername }),
            ...(passwordChanged && { password: newPassword }),
        };

        setSubmitting(true);
        try {
            const valid = await verifyPassword(original.email, currentPassword);
            if (!valid) {
                setStatus({ type: 'error', message: 'Current password is incorrect' });
                clearPasswords();
                return;
            }

            const updated = await updateUser(currentUser.id, payload);

            if (usernameChanged) {
                const loginEmail = emailChanged ? trimmedEmail : original.email;
                const loginPassword = passwordChanged ? newPassword : currentPassword;
                await login({ email: loginEmail, password: loginPassword });
            }

            setOriginal(updated);
            setEmail(updated.email);
            setUsername(updated.username);
            clearPasswords();
            setStatus({ type: 'success', message: 'Account updated' });
        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            clearPasswords();
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        setDeleteStatus(null);
        setDeleting(true);
        try {
            const valid = await verifyPassword(original.email, deletePassword);
            if (!valid) {
                setDeleteStatus({ type: 'error', message: 'Current password is incorrect' });
                setDeletePassword('');
                return;
            }

            await deleteUser(currentUser.id);
            flushSync(() => {
                navigate('/', { state: { successMessage: 'Your account has been deleted' } });
            });
            logout();
        } catch (error) {
            setDeleteStatus({ type: 'error', message: error.message });
            setDeletePassword('');
        } finally {
            setDeleting(false);
        }
    }

    function handleCancelDelete() {
        setConfirmingDelete(false);
        setDeletePassword('');
        setDeleteStatus(null);
    }

    return (
        <div className={styles.page}>
            <FormCard title="Account">
                <p className={styles.intro}>
                    Update your details below. Your current password is required to save any changes.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.fields}>
                        <Field
                            label="Email"
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleFieldChange(setEmail)}
                            onBlur={() => {
                                if (email.trim() === '') {
                                    setEmail(original.email);
                                    setEmailError(null);
                                } else {
                                    setEmailError(validateEmail(email));
                                }
                            }}
                            autoComplete="email"
                            error={emailError}
                        />
                        <Field
                            label="Username"
                            id="username"
                            value={username}
                            onChange={handleFieldChange(setUsername)}
                            onBlur={() => {
                                if (username.trim() === '') {
                                    setUsername(original.username);
                                    setUsernameError(null);
                                } else {
                                    setUsernameError(validateUsername(username));
                                }
                            }}
                            autoComplete="username"
                            error={usernameError}
                        />
                        <Field
                            label="New password"
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={handleFieldChange(setNewPassword)}
                            onBlur={() => {
                                setPasswordError(passwordChanged ? validatePassword(newPassword) : null);
                                if (confirmNewPassword !== '') {
                                    setConfirmError(validatePasswordMatch(newPassword, confirmNewPassword));
                                }
                            }}
                            autoComplete="new-password"
                            error={passwordError}
                        />
                        <Field
                            label="Confirm new password"
                            id="confirmNewPassword"
                            type="password"
                            value={confirmNewPassword}
                            onChange={handleFieldChange(setConfirmNewPassword)}
                            onBlur={() => {setConfirmError(passwordChanged ? validatePasswordMatch(newPassword, confirmNewPassword) : null)}}
                            autoComplete="new-password"
                            error={confirmError}
                        />
                        <Field
                            label="Current password"
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={handleFieldChange(setCurrentPassword)}
                            autoComplete="current-password"
                        />
                    </div>
                    <div className={styles.buttonWrapper}>
                        <Button type="submit" disabled={submitting || !canSubmit}>Save changes</Button>
                    </div>
                </form>
                <StatusMessage type={status?.type} message={status?.message} />
            </FormCard>

            <section className={styles.dangerZone}>
                <h2 className={styles.dangerTitle}>Delete account</h2>
                <p className={styles.dangerText}>
                    This permanently deletes your account and every character you own. This cannot be undone.
                </p>
                {confirmingDelete ? (
                    <div className={styles.confirm}>
                        <Field
                            label="Current password"
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={event => {
                                setDeletePassword(event.target.value);
                                setDeleteStatus(null);
                            }}
                            autoComplete="current-password"
                        />
                        <div className={styles.confirmButtons}>
                            <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={deleting || deletePassword.length === 0}>
                                Delete permanently
                            </button>
                            <button type="button" className={styles.cancelButton} onClick={handleCancelDelete}>
                                Cancel
                            </button>
                        </div>
                        <StatusMessage type={deleteStatus?.type} message={deleteStatus?.message} />
                    </div>
                ) : (
                    <button type="button" className={styles.deleteButton} onClick={() => setConfirmingDelete(true)}>
                        Delete account
                    </button>
                )}
            </section>
        </div>
    );
}