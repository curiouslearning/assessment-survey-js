import type { HostTheme } from './assessment-template-contracts';

export function normalizeHostTheme(theme: string | null | undefined): HostTheme {
  const normalizedTheme = theme?.trim().toLowerCase() ?? '';

  if (normalizedTheme === 'ftm-dim') {
    return 'ftm-dim';
  }

  return 'default';
}

export function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    return '';
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function withBase(baseUrl: string, path: string, rootRelativeAssetPaths: boolean = true): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.replace(/^\/+/, '');

  if (normalizedBase) {
    return `${normalizedBase}/${normalizedPath}`;
  }

  return rootRelativeAssetPaths ? `/${normalizedPath}` : normalizedPath;
}
