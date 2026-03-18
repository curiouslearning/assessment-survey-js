/**
 * Contains utils for working with URL strings.
 */
let runtimeConfigOverrides = {};
export function configureRuntimeConfig(overrides = {}) {
    runtimeConfigOverrides = Object.assign(Object.assign({}, runtimeConfigOverrides), overrides);
}
export function resetRuntimeConfig() {
    runtimeConfigOverrides = {};
}
function getConfigValue(key) {
    const overrideValue = runtimeConfigOverrides[key];
    if (overrideValue !== undefined && overrideValue !== null && overrideValue !== '') {
        return overrideValue;
    }
    const pathParams = getPathName();
    return pathParams.get(key);
}
export function getAppType() {
    const pathParams = getPathName();
    const appType = pathParams.get('appType');
    return appType;
}
export function getUUID() {
    var nuuid = getConfigValue('cr_user_id');
    if (nuuid == undefined) {
        console.log('no uuid provided');
        nuuid = 'WebUserNoID';
    }
    return nuuid;
}
export function getUserSource() {
    var nuuid = getConfigValue('userSource');
    if (nuuid == undefined) {
        console.log('no user source provided');
        nuuid = 'WebUserNoSource';
    }
    return nuuid;
}
export function getDataFile() {
    var data = getConfigValue('data');
    if (data == undefined) {
        console.log('default data file');
        data = 'zulu-lettersounds';
        //data = "survey-zulu";
    }
    return data;
}
// Get App Language From Data URL
export function getAppLanguageFromDataURL(appType) {
    // Check if app type is not empty and split the string by the hyphen then return the first element
    if (appType && appType !== '' && appType.includes('-')) {
        let language = appType.split('-').slice(0, -1).join('-');
        if (language.includes('west-african')) {
            return 'west-african-english';
        }
        else {
            return language;
        }
    }
    return 'NotAvailable';
}
// Get App Type From Data URL
export function getAppTypeFromDataURL(appType) {
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
