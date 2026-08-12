'use strict';

// Pure, side-effect-free helpers for the configurable build base path.
// Shared by webpack.config.js (build-time token injection) and the *.spec.ts
// suites so the build and the tests exercise identical rules.

const BASE_PATH_TOKEN = '__BASE_PATH__';

/**
 * Normalizes a raw BASE_PATH value.
 * - unset / empty / "/" -> "" (served from the domain root)
 * - a trailing slash is trimmed (e.g. "/foo/" -> "/foo")
 */
function normalizeBasePath(raw) {
  if (!raw) {
    return '';
  }

  const trimmed = String(raw).trim();

  if (trimmed === '' || trimmed === '/') {
    return '';
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

/**
 * Replaces every __BASE_PATH__ token in text content with the normalized base
 * path. Used by the copy-webpack-plugin transform for index.html / manifest.json.
 */
function applyBasePath(content, rawBasePath) {
  const basePath = normalizeBasePath(rawBasePath);
  return String(content).split(BASE_PATH_TOKEN).join(basePath);
}

/**
 * The value injected into index.html's data-asset-base-url:
 *   "" -> "/assets", "/foo" -> "/foo/assets".
 */
function assetBaseUrl(rawBasePath) {
  return applyBasePath(`${BASE_PATH_TOKEN}/assets`, rawBasePath);
}

/**
 * The value injected into manifest.json's start_url:
 *   "" -> "/", "/foo" -> "/foo/".
 */
function startUrl(rawBasePath) {
  return applyBasePath(`${BASE_PATH_TOKEN}/`, rawBasePath);
}

/**
 * Resolves a scope-relative URL a service worker should use for its offline
 * shell / fallback precache, given its registration scope. Mirrors the inline
 * logic in sw-src.js (scopePath).
 *   resolveShellUrl("https://host/", "index.html")        -> "/index.html"
 *   resolveShellUrl("https://host/foo/", "index.html")    -> "/foo/index.html"
 */
function resolveShellUrl(scope, file) {
  const target = file || 'index.html';

  try {
    return new URL(target, scope).pathname;
  } catch (e) {
    return `/${target}`;
  }
}

module.exports = {
  BASE_PATH_TOKEN,
  normalizeBasePath,
  applyBasePath,
  assetBaseUrl,
  startUrl,
  resolveShellUrl,
};
