import type { HostTheme } from './assessment-template-contracts';

/**
 * Normalizes a raw theme input into the supported host theme union.
 */
export function normalizeHostTheme(theme: string | null | undefined): HostTheme {
  const normalizedTheme = theme?.trim().toLowerCase() ?? '';

  if (normalizedTheme === 'ftm-dim') {
    return 'ftm-dim';
  }

  return 'default';
}

/**
 * Normalizes a base URL by trimming a trailing slash when present.
 */
export function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    return '';
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

/**
 * Resolves a relative asset path against an optional base URL.
 * Falls back to either root-relative or document-relative paths.
 */
export function withBase(baseUrl: string, path: string, rootRelativeAssetPaths: boolean = true): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.replace(/^\/+/, '');

  if (normalizedBase) {
    return `${normalizedBase}/${normalizedPath}`;
  }

  return rootRelativeAssetPaths ? `/${normalizedPath}` : normalizedPath;
}
