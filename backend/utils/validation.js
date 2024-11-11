export function isValidText(value, minLength = 1) {
    return typeof value === 'string' && value.trim().length >= minLength;
}

export function isValidDate(value) {
    const date = new Date(value);
    return value && !isNaN(date.getTime());
}

export function isValidImageUrl(value) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];
    const urlPattern = /^https?:\/\/.+/; // Check for valid http/https URLs
    return (
        typeof value === 'string' &&
        urlPattern.test(value) &&
        imageExtensions.some(ext => value.toLowerCase().endsWith(ext))
    );
}

export function isValidEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
    return typeof value === 'string' && emailPattern.test(value);
}
