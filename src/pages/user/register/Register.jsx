import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../../../context/auth/useAuth.js'
import { register } from '../../../services/authService.js' 
import { validateEmail, validateUsername, validatePassword, validatePasswordMatch } from '../../../utils/validator.js'
import FormCard from '../../../components/formCard/FormCard.jsx'
import Field from '../../../components/field/Field.jsx'
import Button from '../../../components/button/Button.jsx'
import StatusMessage from '../../../components/statusMessage/StatusMessage.jsx'
import styles from './Register.module.css'

export default function Register() {
    const { isLoggedIn } = useAuth();
    const [alreadyLoggedIn] = useState(isLoggedIn);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState(null);
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [verifyPasswordError, setVerifyPasswordError] = useState(null);
    const [apiError, setApiError] = useState(null);

    const navigate = useNavigate();

    if (alreadyLoggedIn) {
        return (
            <Navigate to='/account' replace />
        )
    }

    const isFormValid =
        validateEmail(email) === null &&
        validateUsername(username) === null &&
        validatePassword(password) === null &&
        validatePasswordMatch(password, verifyPassword) === null;

    function handleChange(setter) {
        return function(event) {
            setter(event.target.value);
            setApiError(null);
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setApiError(null);
        setLoading(true);
        try {
            await register({ email, username, password });
            navigate('/login', { state: { status: {type: 'success', message: 'User created' } } });
        } catch (error) {
            setApiError(error.message);
            setPassword('');
            setVerifyPassword('');
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormCard title="Create User">
            <form onSubmit={handleSubmit}>
                <div className={styles.fields}>
                    <Field
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleChange(setEmail)}
                        onBlur={() => {setEmailError(validateEmail(email))}}
                        autoComplete="email"
                        error={emailError}
                    />
                    <Field
                        label="Username"
                        id="username"
                        value={username}
                        onChange={handleChange(setUsername)}
                        onBlur={() => {setUsernameError(validateUsername(username))}}
                        autoComplete="username"
                        error={usernameError}
                    />
                    <Field
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleChange(setPassword)}
                        onBlur={() => {
                            setPasswordError(validatePassword(password));
                            if (verifyPassword !== '') {
                                setVerifyPasswordError(validatePasswordMatch(password, verifyPassword));
                             }
                        }}
                        autoComplete="new-password"
                        error={passwordError}
                    />
                    <Field
                        label="Verify Password"
                        id="verifyPassword"
                        type="password"
                        value={verifyPassword}
                        onChange={handleChange(setVerifyPassword)}
                        onBlur={() => {setVerifyPasswordError(validatePasswordMatch(password, verifyPassword))}}
                        autoComplete="new-password"
                        error={verifyPasswordError}
                    />
                </div>
                <div className={styles.buttonWrapper}>
                    <Button type="submit" disabled={loading || !isFormValid}>Create User</Button>
                </div>
            </form>
            <StatusMessage status={apiError ? { type: 'error', message: apiError } : null} />
            <div className={styles.footer}>
                <span>Already have an account? <Link to="/login">Login</Link></span>
            </div>
        </FormCard>
    )
}