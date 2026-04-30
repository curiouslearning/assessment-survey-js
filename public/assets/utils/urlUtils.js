export function getAppType() {
    const pathParams = getPathName();
    const appType = pathParams.get('appType');
    return appType;
}
export function getUUID() {
    const pathParams = getPathName();
    var nuuid = pathParams.get('cr_user_id');
    if (nuuid == undefined) {
        console.log('no uuid provided');
        nuuid = 'WebUserNoID';
    }
    return nuuid;
}
export function getUserSource() {
    const pathParams = getPathName();
    var nuuid = pathParams.get('userSource');
    if (nuuid == undefined) {
        console.log('no user source provided');
        nuuid = 'WebUserNoSource';
    }
    return nuuid;
}
export function getDataFile() {
    const pathParams = getPathName();
    var data = pathParams.get('data');
    if (data == undefined) {
        console.log('default data file');
        data = 'zulu-lettersounds';
    }
    return data;
}
export function getAppLanguageFromDataURL(appType) {
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
export function getAppTypeFromDataURL(appType) {
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
//# sourceMappingURL=urlUtils.js.map