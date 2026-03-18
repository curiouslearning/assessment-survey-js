let assetBaseUrl = '';
function normalizeBaseUrl(baseUrl) {
    if (!baseUrl) {
        return '';
    }
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}
export function setAssetBaseUrl(baseUrl = '') {
    assetBaseUrl = normalizeBaseUrl(baseUrl);
}
export function getAssetBaseUrl() {
    return assetBaseUrl;
}
export function resolveAssetPath(path) {
    if (!path) {
        return path;
    }
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
        return path;
    }
    const normalizedPath = path.replace(/^\/+/, '');
    if (!assetBaseUrl) {
        return `/${normalizedPath}`;
    }
    return `${assetBaseUrl}/${normalizedPath}`;
}
