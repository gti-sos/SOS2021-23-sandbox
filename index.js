var cool = require("cool-ascii-faces");
var express = require("express");
var serveIndex = require('serve-index');
// var path = require("path");
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

// app.use("/", express.static(path.join(_dirname,"public")));
/* La carpeta public estarรก disponible en /public */
app.use('/public', serveIndex('public')); // shows you the file list
app.use('/public', express.static('public')); // serve the actual files
/*----------------------------------------------- */
app.get('/hello', (req, res) => {
	res.send("<html><body><h1> Hello! From tiny express server!</h1></body></html>");
	console.log("New GET request to /hello has arrived");
})

app.post('/hello', (req, res) => {
	res.send("<html><body><h1> Hello! From tiny express server!</h1></body></html>");
	console.log("New POST request to /hello has arrived");
})

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