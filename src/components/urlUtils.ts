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
	var nuuid = pathParams.get('uuid');
	if (nuuid == undefined) {
		console.log("no uuid provided");
		nuuid = "WebUserNoID"
	}
	return nuuid;
}

export function getDataFile(): string {
	const pathParams = getPathName();
	var data = pathParams.get('data');
	if (data == undefined) {
		console.log("default data file");
		data = "default";
	}
	return data;
}



function getPathName() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	return urlParams;
}
