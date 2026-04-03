/**
 * Contains utils for working with URL strings.
 */

export type RuntimeConfigOverrides = {
  data?: string;
  cr_user_id?: string;
  userSource?: string;
  requiredScore?: string;
  nextAssessment?: string;
  endpoint?: string;
  organization?: string;
};

let runtimeConfigOverrides: RuntimeConfigOverrides = {};

export function configureRuntimeConfig(overrides: RuntimeConfigOverrides = {}): void {
  runtimeConfigOverrides = {
    ...runtimeConfigOverrides,
    ...overrides,
  };
}

export function resetRuntimeConfig(): void {
  runtimeConfigOverrides = {};
}

function getConfigValue(key: keyof RuntimeConfigOverrides): string | null {
  const overrideValue = runtimeConfigOverrides[key];
  if (overrideValue !== undefined && overrideValue !== null && overrideValue !== '') {
    return overrideValue;
  }

  const pathParams = getPathName();
  return pathParams.get(key);
}

export function getAppType(): string {
  const pathParams = getPathName();
  const appType = pathParams.get('appType');
  return appType;
}

export function getUUID(): string {
  var nuuid = getConfigValue('cr_user_id');
  if (nuuid == undefined) {
    console.log('no uuid provided');
    nuuid = 'WebUserNoID';
  }
  return nuuid;
}

export function getUserSource(): string {
  var nuuid = getConfigValue('userSource');
  if (nuuid == undefined) {
    console.log('no user source provided');
    nuuid = 'WebUserNoSource';
  }
  return nuuid;
}

export function getDataFile(): string {
  var data = getConfigValue('data');
  if (data == undefined) {
    console.log('default data file');
    data = 'zulu-lettersounds';
    //data = "survey-zulu";
  }
  return data;
}
// Get App Language From Data URL
export function getAppLanguageFromDataURL(appType: string): string {
  if (!appType || appType === '') {
    return 'NotAvailable';
  }

  if (!appType.includes('-')) {
    return 'NotAvailable';
  }

  const language = appType.split('-').slice(0, -1).join('-');
  if (language === '') {
    return 'en';
  }

  if (language.includes('west-african')) {
    return 'west-african-english';
  }

  return language;
}
// Get App Type From Data URL
export function getAppTypeFromDataURL(appType: string): string {
  // Check if app type is not empty and split the string by the hyphen then return the last element
  if (appType && appType !== '' && appType.includes('-')) {
    return appType.substring(appType.lastIndexOf('-') + 1);
  }

  return 'NotAvailable';
}
export function getRequiredScore() {
  return getConfigValue('requiredScore');
}
export function getNextAssessment() {
  return getConfigValue('nextAssessment');
}

export function getEndpoint() {
  return getConfigValue('endpoint');
}

export function getOrganization() {
  return getConfigValue('organization');
}

function getPathName() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}
