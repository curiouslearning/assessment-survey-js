



export async function fetchAppType(url: string){

 	return loadData(url).then(data =>{return data["appType"];});
}

export async function fetchSurveyQuestions(url:string){
	return loadData(url).then(data=>{return data["questions"]})
}

export async function fetchAssessmentBuckets(url:string){
	return loadData(url).then(data=>{return data["buckets"]})
}


async function loadData(url: string){

		var furl = "./data/" + url + ".json";
		console.log(furl);
	return	fetch(furl)
  .then(response => response.json());

}
