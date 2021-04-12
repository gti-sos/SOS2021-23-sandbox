var BASE_API_PATH_SEC="/api/v1/du-stats";
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
var du_countries = [];
// 5.2
app.get(BASE_API_PATH_SEC+"/loadInitialData", (request, response) =>{
	if (du_countries.length == 0) {
		try {
		let rawdata = fs.readFileSync('du-stats.json');
		du_countries = JSON.parse(rawdata);
		} catch {
			console.log('Error parsing .json file');
	}
		console.log('[!] du-stats.json loaded onto du_countries');
		console.log(JSON.stringify(du_countries, null));
		response.status(200).send("<h3>Successfuly loaded "+ du_countries.length + " resources</h3><p>You can head now to /api/v1/mh-stats to check newly created resources</p>")
	} else {
		console.log('[!] GET request to /loadInitialData but resources are already loaded.');
		response.status(400).send("<h1>Resources already loaded. Head back to /api/v1/du-stats to check them.</h1>")
	}
});

// 5.1 y 6.1
app.get(BASE_API_PATH_SEC, (request, response) =>{
	if (du_countries.length == 0) {
		console.log('[!] Resource du_countries has been requested, but are not loaded.');
		response.status(404).send("<p>Resources not found. Head to /loadInitialData to create them.</p>");
	} else {
		console.log('[!] Resource du_countries has been requested');
		response.status(200).send(JSON.stringify(du_countries,null, 2));
	}
});

// 6.2
// Auxiliary function to test if JSON object exists in JSON array.


app.post(BASE_API_PATH_SEC, (request, response) =>{
	var country;
	du_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			country = obj;
		}
	});
	if (isAO(request.body) && request.body.length != 0 && country == null) {
		var newCountry = request.body;
		console.log(`Add new country: <${JSON.stringify(newCountry, null)}>`);
		du_countries.push(newCountry);
		response.status(201).send("<p>New resource created.</p>");
	} else{
		console.log("[-] Received malformed or empty JSON when trying to add a new resource. \n-->"+JSON.stringify(newCountry, null));
		response.status(400).send("<p>400: Bad or empty JSON has been provided.</p>");
	}
});

// 6.7
app.put(BASE_API_PATH_SEC, (request, response) => {
	console.log("[!] Method (PUT) not allowed at " + BASE_API_PATH_SEC);
	response.status(405).send('<p>405: Method not allowed</p>');
});

// 6.8
app.delete(BASE_API_PATH_SEC, (request, response) => {
	console.log("[-] Full deletion has been requested. Proceeding.");
	if (du_countries.length == 0) {
		response.status(400).send("<p>400: No resources found. Can't delete any.</p>");
	} else {
		du_countries.length = 0;
		console.log(du_countries.length);
		response.status(200).send("<p>200: All resources deleted.</p>");	
	}
});

// 6.3
app.get(BASE_API_PATH_SEC+"/:country/:year", (request, response) => {
	console.log("[!] GET to " + request.params.country + ", checking if exists.");
	var country;
	du_countries.forEach(function(obj) {
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
app.post(BASE_API_PATH_SEC+"/:country/:year", (request, response) => {
	console.log("[!] Method not allowed (POST) to /" + request.params.country +"/"+request.params.year);
	response.status(405).send('<p>405: Method not allowed</p>');
});

// 6.4
app.delete(BASE_API_PATH_SEC+"/:country/:year", (request, response) => {
	var oldCountry;
	console.log("[!] Deletion requested for resource: /"+request.params.country+"/"+request.params.year+"\n [?] Checking existence.");
		du_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			oldCountry = obj;
		}
	});
	if (oldCountry != null) {
		console.log("[-] Delete: "+ JSON.stringify(oldCountry,null));
		delete du_countries[oldCountry];
		response.status(200).send("<p>Resource deleted</p>");	
	} else {
		console.log("[!] Someone has tried to delete a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});

// 6.5
app.put(BASE_API_PATH_SEC+"/:country/:year", (request, response) => {
	var updateCountry = request.body;
	var oldCountry;
	console.log(`[!] New country to update: <${JSON.stringify(updateCountry, null)}>`);
			du_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			oldCountry = obj;
		}
	});
	if (oldCountry != null) {
		console.log("[-] Delete "+ JSON.stringify(oldCountry, null)+" to add resource: \n-->"+ JSON.stringify(updateCountry, null));
		delete du_countries[oldCountry];
		response.status(200).send("<p>Resource updated.</p>");
		du_countries.push(updateCountry);	
	} else {
		console.log("[!] Someone has tried to update a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});
}