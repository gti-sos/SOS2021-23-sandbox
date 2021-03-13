var cool = require("cool-ascii-faces");
var express = require("express");
var serveIndex = require('serve-index');
var app = express();

var port = 11337;

function hehe() {
	var res = "<h3> Welcome to /cool, an exclusive lounge for cool! people </h3><br><p> These are the faces of our coolest members </p><br>";
	var i = 0;
	while (i < 20) {
		res = res + cool() + "<br>";
		i++;
	}
	return res;
}

/* La carpeta public estará disponible en /public */
app.use('/public', serveIndex('public')); // shows you the file list
app.use('/public', express.static('public')); // serve the actual files
/*----------------------------------------------- */

app.get("/",(request, response) => {
	response.send("<h1>Welcome to SOS2021-23</h1><br>" + cool());
	console.log("New request to / has arrived");
});

app.get("/cool",(request, response) => {
	response.send(hehe());
	console.log("New request to /cool has arrived");
});

app.listen(port, () => {
	console.log("Server is ready, listening on port " + port);
});