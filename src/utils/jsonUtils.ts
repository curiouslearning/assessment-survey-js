/** Json Utils */

// import { setFeedbackText } from './uiController';

export async function fetchAppData(url: string) {
  return loadData(url).then((data) => {
    return data;
  });
}

export async function fetchAppType(url: string) {
  return loadData(url).then((data) => {
    // setFeedbackText(data["feedbackText"]);
    return data['appType'];
  });
}

export async function fetchFeedback(url: string) {
  return loadData(url).then((data) => {
    return data['feedbackText'];
  });
}

export async function fetchSurveyQuestions(url: string) {
  return loadData(url).then((data) => {
    return data['questions'];
  });
}

export async function fetchAssessmentBuckets(url: string) {
  return loadData(url).then((data) => {
    return data['buckets'];
  });
}

export function getDataURL(url: string) {
  if (!url) return url;
  const trimmed = url.trim();

  // If it's already a full URL or a path to a json file, return as-is (or ensure .json extension)
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.endsWith('.json')
  ) {
    // If the path contains /data/ but is missing extension, add it
    if (trimmed.includes('/data/') && !trimmed.endsWith('.json')) {
      return trimmed + '.json';
    }
    return trimmed;
  }

  // Fallback: treat value as a short key and construct the data path
  return '/data/' + trimmed + '.json';
}

export function getAudioDirectory(dataURL: string): string {
  if (!dataURL) return 'zulu-lettersounds'; // fallback
  
  // Remove any leading path (e.g., 'english/', 'data/', 'assessment-data/')
  let dirName = dataURL.split('/').pop() || dataURL;
  
  // Remove .json extension if present
  dirName = dirName.replace(/\.json$/, '');
  
  return dirName;
}

export function getCaseIndependentLangList() {
  return ['luganda'];
}

async function loadData(url: string) {
  const furl = getDataURL(url);
  const requestUrl = furl.toString();

  // Try to read from the Service Worker's cache first (if available).
  try {
    if (typeof caches !== 'undefined' && caches.match) {
      const cachedResponse = await caches.match(requestUrl);
      if (cachedResponse) {
        return cachedResponse.json();
      }
    }
  } catch (err) {
    // Ignore cache lookup errors and fall back to network
    console.warn('Cache lookup failed for', requestUrl, err);
  }

  // Fall back to network fetch. Use no-store so we always fetch fresh when
  // explicitly requested (Service Worker should still serve cached entries).
  const response = await fetch(requestUrl, { cache: 'no-store' });
  return response.json();
}
