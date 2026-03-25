export function toBasePath(path) {
    const urlString = path.startsWith('http')
        ? path
        : `https://${trimSlashes(path)}`;
    try {
        const url = new URL(urlString);
        return url.hostname;
    }
    catch (_a) {
        const withoutProtocol = urlString.replace(/^https?:\/\//, '');
        return withoutProtocol.split('/')[0];
    }
}
export function trimSlashes(value) {
    while (value.startsWith('/')) {
        value = value.substring(1);
    }
    return value;
}
