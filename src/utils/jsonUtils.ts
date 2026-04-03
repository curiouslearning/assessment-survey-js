/** Json Utils */
let dataBaseUrl = '';

function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl) {
    return '';
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function setDataBaseUrl(baseUrl: string = ''): void {
  dataBaseUrl = normalizeBaseUrl(baseUrl);
}

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
  const relativePath = `data/${url}.json`;

  if (!dataBaseUrl) {
    return `/${relativePath}`;
  }

  return `${dataBaseUrl}/${relativePath}`;
}

export function getCaseIndependentLangList() {
  return ['luganda'];
}

async function loadData(url: string) {
  var furl = getDataURL(url);
  //console.log({ furl });
  return fetch(furl).then((response) => response.json());
}
