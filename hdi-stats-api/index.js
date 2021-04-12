var hdi_countries = [];
var BASE_API_PATH_MEM="/api/v1/hdi-stats";

module.exports.register = (app) => {
// 5.2
app.get(BASE_API_PATH_MEM+"/loadInitialData", (request, response) =>{
	if (hdi_countries.length == 0) {
		try {
			hdi_countries = require("./hdi-stats.json");
		} catch {
			console.log('Error parsing .json file');
	}
		console.log('[!] hdi-stats.json loaded onto hdi_countries');
		console.log(JSON.stringify(hdi_countries, null));
		response.status(200).send("<h3>Successfuly loaded "+ hdi_countries.length + " resources</h3><p>You can head now to /api/v1/hdi-stats to check newly created resources</p>")
	} else {
		console.log('[!] GET request to /loadInitialData but resources are already loaded.');
		response.status(400).send("<h1>Resources already loaded. Head back to /api/v1/hdi-stats to check them.</h1>")
	}
});

// 5.1 y 6.1
app.get(BASE_API_PATH_MEM, (request, response) =>{
	if (hdi_countries.length == 0) {
		console.log('[!] Resource hdi_countries has been requested, but are not loaded.');
		response.status(404).send("<p>Resources not found. Head to /loadInitialData to create them.</p>");
	} else {
		console.log('[!] Resource hdi_countries has been requested');
		response.status(200).send(JSON.stringify(hdi_countries,null, 2));
	}
});

app.post(BASE_API_PATH_MEM, (request, response) =>{
	var country;
	hdi_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			country = obj;
		}
	});
	if (isAO(request.body) && request.body.length != 0 && country == null) {
		var newCountry = request.body;
		console.log(`Add new country: <${JSON.stringify(newCountry, null)}>`);
		hdi_countries.push(newCountry);
		response.status(201).send("<p>New resource created.</p>");
	} else{
		console.log("[-] Received malformed or empty JSON when trying to add a new resource. \n-->"+JSON.stringify(newCountry, null));
		response.status(400).send("<p>400: Bad or empty JSON has been provided.</p>");
	}
});

// 6.7
app.put(BASE_API_PATH_MEM, (request, response) => {
	console.log("[!] Method (PUT) not allowed at " + BASE_API_PATH_MEM);
	response.status(405).send('<p>405: Method not allowed</p>');
});

// 6.8
app.delete(BASE_API_PATH_MEM, (request, response) => {
	console.log("[-] Full deletion has been requested. Proceeding.");
	if (hdi_countries.length == 0) {
		response.status(400).send("<p>400: No resources found. Can't delete any.</p>");
	} else {
		hdi_countries.length = 0;
		console.log(hdi_countries.length);
		response.status(200).send("<p>200: All resources deleted.</p>");	
	}
});

// 6.3
app.get(BASE_API_PATH_MEM+"/:country/:year", (request, response) => {
	console.log("[!] GET to " + request.params.country + ", checking if exists.");
	var country;
	hdi_countries.forEach(function(obj) {
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
app.post(BASE_API_PATH_MEM+"/:country/:year", (request, response) => {
	console.log("[!] Method not allowed (POST) to /" + request.params.country +"/"+request.params.year);
	response.status(405).send('<p>405: Method not allowed</p>');
});

// 6.4
app.delete(BASE_API_PATH_MEM+"/:country/:year", (request, response) => {
	var oldCountry;
	console.log("[!] Deletion requested for resource: /"+request.params.country+"/"+request.params.year+"\n [?] Checking existence.");
	hdi_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			oldCountry = obj;
		}
	});
	if (oldCountry != null) {
		console.log("[-] Delete: "+ JSON.stringify(oldCountry,null));
		delete hdi_countries[oldCountry];
		response.status(200).send("<p>Resource deleted</p>");	
	} else {
		console.log("[!] Someone has tried to delete a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});

// 6.5
app.put(BASE_API_PATH_MEM+"/:country/:year", (request, response) => {
	var updateCountry = request.body;
	var oldCountry;
	console.log(`[!] New country to update: <${JSON.stringify(updateCountry, null)}>`);
	hdi_countries.forEach(function(obj) {
		if (obj.country == request.params.country && obj.year == request.params.year) {
			oldCountry = obj;
		}
	});
	if (oldCountry != null) {
		console.log("[-] Delete "+ JSON.stringify(oldCountry, null)+" to add resource: \n-->"+ JSON.stringify(updateCountry, null));
		delete hdi_countries[oldCountry];
		response.status(200).send("<p>Resource updated.</p>");
		hdi_countries.push(updateCountry);	
	} else {
		console.log("[!] Someone has tried to update a non-existent resource: \n-->" + JSON.stringify(oldCountry, null));
		response.status(400).send("<p>Resource not found, can't delete.</p>");
	}
});
}