var BASE_API_PATH_ACE="/api/v1/unemployment-stats";
const fs = require('fs');

function isAO(val) {
    return val instanceof Array || val instanceof Object ? true : false;
}

function elementExists(obj, obj_t) {
	for (var i = 0; i < obj.length; i++) {
		if (obj[i] == obj_t) {
			return true;
		} else {
			false;
		}
	}
}

module.exports.register = (app) => {
// API DEV (unemployment-stats)
var unemployment_countries = [];
// 5.2
app.get(BASE_API_PATH_ACE+"/loadInitialData", (request, response) =>{
	if (unemployment_countries.length == 0) {
		try {
		let rawdata = fs.readFileSync('unemployment-stats.json');
		unemployment_countries = JSON.parse(rawdata);
		} catch {
			console.log('Error parsing .json file');
	}
		console.log('[!] unemployment-stats.json loaded onto unemployment_countries');
		console.log(JSON.stringify(unemployment_countries, null));
		response.status(200).send("<h3>Successfuly loaded "+ unemployment_countries.length + " resources</h3><p>You can head now to /api/v1/unemployment-stats to check newly created resources</p>")
	} else {
		console.log('[!] GET request to /loadInitialData but resources are already loaded.');
		response.status(400).send("<h1>Resources already loaded. Head back to /api/v1/unemployment-stats to check them.</h1>")
	}
});

// 5.1 y 6.1
app.get(BASE_API_PATH_ACE, (request, response) =>{
	if (unemployment_countries.length == 0) {
		console.log('[!] Resource unemployment_countries has been requested, but are not loaded.');
		response.status(404).send("<p>Resources not found. Head to /loadInitialData to create them.</p>");
	} else {
		console.log('[!] Resource unemployment_countries has been requested');
		response.status(200).send(JSON.stringify(unemployment_countries,null, 2));
	}
});

app.post(BASE_API_PATH_ACE, (request, response) =>{
	var updateCountry = request.body;
	console.log(updateCountry.country);
		console.log(updateCountry.year);
	var oldCountry;
	var del_index;
	console.log(`[!] Received: <${JSON.stringify(updateCountry, null)}> checking for coincidences...`);
	for(var i=0; i<unemployment_countries.length; i++){
		if(unemployment_countries[i].country==updateCountry.country && unemployment_countries[i].year==updateCountry.year){
			oldCountry = unemployment_countries[i];
			del_index = i;
		}
	}
	if (oldCountry == null) {
		console.log("[!] POST with: \n-->" + JSON.stringify(updateCountry, null) + " :: Not found in array.");
		response.status(200).send("<p>Added resource.</p>");
		unemployment_countries.push(updateCountry);
	} else if (JSON.stringify(oldCountry, null) == JSON.stringify(updateCountry, null)) {
		console.log("[!] Someone has tried upload an existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource already exists.</p>");
	} else {
		console.log("[!] POST containing: \n-->" + JSON.stringify(updateCountry, null));
		response.status(400).send("<p>Error</p>");
	}
});

// 6.7
app.put(BASE_API_PATH_ACE, (request, response) => {
	console.log("[!] Method (PUT) not allowed at " + BASE_API_PATH_ACE);
	response.status(405).send('<p>405: Method not allowed</p>');
});

// 6.8
app.delete(BASE_API_PATH_ACE, (request, response) => {
	console.log("[-] Full deletion has been requested. Proceeding.");
	if (unemployment_countries.length == 0 || unemployment_countries == null) {
		response.status(400).send("<p>400: No resources found. Can't delete any.</p>");
	} else {
		unemployment_countries.length = 0;
		console.log(unemployment_countries.length);
		response.status(200).send("<p>200: All resources deleted.</p>");
	}
});

// 6.3
app.get(BASE_API_PATH_ACE+"/:country/:year", (request, response) => {
	console.log("[!] GET to " + request.params.country + ", checking if exists.");
	var country;
	unemployment_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			country = obj;
		}
	});
	if (isAO(country) && country != null) {
		response.status(200).send(JSON.stringify(country, null, 2));	
	} else {
		console.log("[!] Someone has tried to GET a non-existent resource: \n-->" + request.params.country + "/" + request.params.year);
		response.status(404).send("<p>404: Resource not found</p>");	
	}
});

// 6.6
app.post(BASE_API_PATH_ACE+"/:country/:year", (request, response) => {
	console.log("[!] Method not allowed (POST) to /" + request.params.country +"/"+request.params.year);
	response.status(405).send('<p>405: Method not allowed</p>');
});

// 6.4
app.delete(BASE_API_PATH_ACE+"/:country/:year", (request, response) => {
	var oldCountry;
	var del_index;
	console.log("[!] Deletion requested for resource: /"+request.params.country+"/"+request.params.year+"\n [?] Checking existence.");
	for(var i=0; i<unemployment_countries.length; i++){
		if(unemployment_countries[i].country==request.params.country && unemployment_countries[i].year==request.params.year){
			oldCountry = unemployment_countries[i];
			del_index = i;
		}
	}
	if (oldCountry != null) {
		console.log("[-] Delete: "+ JSON.stringify(oldCountry,null));
		unemployment_countries.splice(del_index, 1);
		response.status(200).send("<p>Resource deleted</p>");	
	} else {
		console.log("[!] Someone has tried to delete a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});

// 6.5
app.put(BASE_API_PATH_ACE+"/:country/:year", (request, response) => {
	var updateCountry = request.body;
	var oldCountry;
	var del_index;
	console.log(`[!] New country to update: <${JSON.stringify(updateCountry, null)}>`);
	for(var i=0; i<unemployment_countries.length; i++){
		if(unemployment_countries[i].country==request.params.country && unemployment_countries[i].year==request.params.year){
			oldCountry = unemployment_countries[i];
			del_index = i;
		}
	}
	if (oldCountry != null) {
		console.log("[-] Delete "+ JSON.stringify(oldCountry, null)+" to add resource: \n-->"+ JSON.stringify(updateCountry, null));
		unemployment_countries.splice(del_index, 1);
		response.status(200).send("<p>Resource updated.</p>");
		unemployment_countries.push(updateCountry);
	} else {
		console.log("[!] Someone has tried to update a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});
}