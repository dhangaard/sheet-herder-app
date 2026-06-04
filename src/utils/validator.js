// Variables and regex used for validation - kept identical to server validation
const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 8;

const EMAIL_REGEX = /^[a-z\d._%+\-]+@[a-z\d.\-]+\.[a-z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z\d_\-]+$/;
// Matches Java's \p{Punct} — no direct equivalent in JS
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

export function validateEmail(email) {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
        return 'Email cannot be blank';
    }
    if (!EMAIL_REGEX.test(normalized)) {
        return 'Invalid email format';
    }
    return null;
}

export function validateUsername(username) {
    const trimmed = username.trim();
    if (!trimmed) {
        return 'Username cannot be blank';
    }
    if (trimmed.length < MIN_USERNAME_LENGTH) {
        return `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
    }
    if (!USERNAME_REGEX.test(trimmed)) {
        return 'Username can only contain letters, digits, underscores and hyphens';
    }
    return null;
}

export function validatePassword(password) {
    if (!password) {
        return 'Password cannot be blank';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (!PASSWORD_REGEX.test(password)) {
        return 'Password must contain uppercase, lowercase, digit and special character';
    }
    return null;
}

export function validatePasswordMatch(password, verifyPassword) {
    if (password !== verifyPassword) {
        return 'Passwords do not match';
    }
    return null;
}