/**
 * Contains utils for working with URL strings.
 */

export function getAppType(): string {
  const pathParams = getPathName();
  const appType = pathParams.get('appType');
  return appType;
}

export function getUUID(): string {
  const pathParams = getPathName();
  var nuuid = pathParams.get('cr_user_id');
  if (nuuid == undefined) {
    console.log('no uuid provided');
    nuuid = 'WebUserNoID';
  }
  return nuuid;
}

export function getUserSource(): string {
  const pathParams = getPathName();
  var nuuid = pathParams.get('userSource');
  if (nuuid == undefined) {
    console.log('no user source provided');
    nuuid = 'WebUserNoSource';
  }
  return nuuid;
}

export function getDataFile(): string {
  const pathParams = getPathName();
  var data = pathParams.get('data');
  if (data == undefined) {
    console.log('default data file');
    data = 'zulu-lettersounds';
    //data = "survey-zulu";
  }
  return data;
}
// Get App Language From Data URL
export function getAppLanguageFromDataURL(appType: string): string {
  // Check if app type is not empty and split the string by the hyphen then return the first element
  if (appType && appType !== '' && appType.includes('-')) {
    let language: string = appType.split('-').slice(0, -1).join('-');
    if (language.includes('west-african')) {
      return 'west-african-english';
    } else {
      return language;
    }
  }

  return 'NotAvailable';
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
  let pathParams = getPathName();
  return pathParams.get("requiredScore");
}
export function getNextAssessment() {
  let pathParams = getPathName();
  return pathParams.get("nextAssessment");
}

function getPathName() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams;
}
