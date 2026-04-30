let assetBaseUrl = '';

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    return '';
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function setAssetBaseUrl(baseUrl: string = ''): void {
  assetBaseUrl = normalizeBaseUrl(baseUrl);
}

export function getAssetBaseUrl(): string {
  return assetBaseUrl;
}

export function resolveAssetPath(path: string): string {
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
