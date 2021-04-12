// Dependencias
var express = require("express");
var app = express();
var cool = require("cool-ascii-faces");
var serveIndex = require('serve-index');
var path = require("path");
var bodyParser = require("body-parser");
const fs = require('fs');

// Inicialización de puerto
var port = process.env.PORT || 11337;

// Inicialización de APIs
app.use(bodyParser.json());
//mh-stats
var mh_api = require("./mh-stats-api");
mh_api.register(app);
//du-stats
var du_api = require("./drug-use-api");
du_api.register(app);
//hdi-stats
var hdi_api = require("./hdi-stats-api");
hdi_api.register(app);
//unemployment-stats
var unemployment_api = require("./unemployment-stats-api");
unemployment_api.register(app);

// Raíces del servicio
app.use('/public', serveIndex('public')); // shows you the file list
app.use('/public', express.static(path.join(__dirname,"public")));// serve the actual files
app.use(express.static(path.join(__dirname,"public")));

// Funciones auxiliares para las que no merece crear una librería
function hehe() {
	var res = "<h3> Welcome to /cool, an exclusive lounge for cool! people </h3><br><p> These are the faces of our coolest members </p><br>";
	var i = 0;
	while (i < 20) {
		res = res + cool() + "<br>";
		i++;
	}
	return res;
}

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

// Métodos GET y POST no relacionados con ninguna API
app.get('/info/mh-stats', (req, res) => {
	res.send("<html><head><link rel='stylesheet' type='text/css' href='/css/mh-stats.css'/></head><body><p>(E.C.G) Source: <a href='https://www.singlecare.com/blog/news/mental-health-statistics/'>here</a></p><table class='tableizer-table'><thead><tr class='tableizer-firstrow'><th>country</th><th>year</th><th>mh-population</th><th>mh-anxdaly</th><th>mh-eating</th><th>mh-adhd</th><th>mh-bipolar</th><th>mh-depression</th><th>mh-schizophrenia</th></tr></thead><tbody><tr><td>Spain</td><td>2017</td><td>46.6</td><td>463.69</td><td>257,180.25</td><td>530,553.88</td><td>451,100.50</td><td>1,82 million</td><td>152,911</td></tr><tr><td>France</td><td>2017</td><td>65</td><td>576.03</td><td>280,994.90</td><td>496,640.31</td><td>600,789.21</td><td>2,95 million</td><td>179,592</td></tr><tr><td>Germany</td><td>2017</td><td>83.1</td><td>565.03</td><td>280,994.90</td><td>217,172.39</td><td>651,663.25</td><td>3,66 million</td><td>239,739</td></tr><tr><td>United Kingdom</td><td>2017</td><td>66.2</td><td>406.09</td><td>292,074.93</td><td>493,584.81</td><td>700,204.25</td><td>2,9 million</td><td>191,745</td></tr><tr><td>USA</td><td>2017</td><td>325.4</td><td>573.38</td><td>1,036,000</td><td>3,016,000</td><td>2,006,000</td><td>15,5 million</td><td>1.15 million</td></tr><tr><td>Brazil</td><td>2017</td><td>207.9</td><td>554.75</td><td>601,275.09</td><td>2,061,000</td><td>2,041,000</td><td>7,22 million</td><td>469,324</td></tr><tr><td>Mexico</td><td>2017</td><td>129.2</td><td>289.05</td><td>395,538.83</td><td>797,378.30</td><td>1,000,000</td><td>3,34 million</td><td>258,084</td></tr><tr><td>Canada</td><td>2017</td><td>36.7</td><td>450.76</td><td>134,371.87</td><td>346,346.07</td><td>252,358.84</td><td>1,44 million</td><td>124,944</td></tr><tr><td>Greenland</td><td>2017</td><td>56,172 (total)</td><td>500.98</td><td>265.02</td><td>623.68</td><td>333.38</td><td>3,455.15</td><td>196</td></tr><tr><td>Italy</td><td>2017</td><td>60.5</td><td>499.21</td><td>275,512.61</td><td>462,874.53</td><td>579,379.78</td><td>2,39 million</td><td>167,800</td></tr></tbody></table><p>Data needs to be normalized</p></body></html>");
	console.log("New GET request to /info/mh-stats has arrived");
})

app.get('/info/unemployment-stats', (req, res) => {
	res.send("<html><head><link rel='stylesheet' type='text/css' href='/css/mh-stats.css'/></head><body><p>(A.C.E) Source: <a href='https://knoema.es/blizore/unemployment-rate-by-country-2019-data-and-charts'>Source 1</a> <a href='https://www.gfmag.com/global-data/economic-data/worlds-unemployment-ratescom'>Source 2</a> <a href='https://photius.com/rankings/2019/economy/unemployment_rate_2019_image.html'>Source 3</a> </p><table class='tableizer-table'><thead><tr class='tableizer-firstrow'><th>country</th><th>year</th><th>kno-perc</th><th>int-perc</th><th>gf-perc</th></tr></thead><tbody><tr><td>Canada</td><td>2020</td><td>5.4</td><td>5.6</td><td>9.7</td></tr><tr><td>United States</td><td>2020</td><td>3.9</td><td>4.4</td><td>8.8</td></tr><tr><td>United Kingdom</td><td>2020</td><td>4.1</td><td>3.9</td><td>5.3</td></tr><tr><td>Germany</td><td>2020</td><td>3</td><td>3.2</td><td>4.2</td></tr><tr><td>Japan</td><td>2020</td><td>2.3</td><td>2.4</td><td>3.3</td></tr><tr><td>Spain</td><td>2020</td><td>13</td><td>13.6</td><td>16.8</td></tr><tr><td>Brazil</td><td>2020</td><td>12</td><td>11.6</td><td>13.3</td></tr></tbody></table> </body></html>");
	console.log("New GET request to /info/unemployment-stats has arrived");
})

app.get('/info/drug-use', (req, res) => {
	res.send("<html><head><link rel='stylesheet' type='text/css' href='/css/mh-stats.css'/></head><body><p>(J.C.T.M) Source: <a href='https://ourworldindata.org/illicit-drug-use'>Source <a href='https://ourworldindata.org/illicit-drug-use'></a></p><table class='tableizer-table'><thead><tr class='tableizer-firstrow'>th>country</th><th>year</th><th>du-population</th><th>du-dead</th><th>du-dependence-perc</th><th>du-dalys</th></tr></thead><tbody><tr><td>Spain</td><td>2017</td><td>46.6</td><td>1.83</td><td>1.47</td><td>249.83</td></tr> <tr><td>France</td><td>2017</td><td>65</td><td>5.5</td><td>1.18</td><td>254.95</td></tr><tr><td>Germany</td><td>2017</td><td>83.1</td><td>6.7</td><td>0.88</td><td>241.92</td></tr><tr><td>United Kingdom</td><td>2017</td><td>66.2</td><td>6.98</td><td>1.66</td><td>525.75</td></tr><tr><td>USA</td><td>2017</td><td>325.4</td><td>21.99</td><td>3.45</td><td>1.6955,55</td></tr><tr><td>Brazil</td><td>2017</td><td>207.9</td><td>5.5</td><td>1.06</td><td>276.1</td></tr><tr><td>Mexico</td><td>2017</td><td>129.2</td><td>5.09</td><td>0.82</td><td>248.29</td></tr><tr><td>Canada</td><td>2017</td><td>36.7</td><td>7.27</td><td>2.28</td><td>756.15</td></tr><tr><td>Greenland</td><td>2017</td><td>56</td><td>13.93</td><td>1.99</td><td>480.89</td></tr><tr><td>Italy</td><td>2017</td><td>60.5</td><td>1.19</td><td>1.15</td><td>257.85</td></tr> <tr><td>&nbsp;</td><td>&nbsp;</td><td>(millions)</td><td>(per 100.000)</td><td>(in total pob)</td><td>(per 100.000)</td></tr></tbody></table> </body></html>");
	console.log("New GET request to /info/drugs-use has arrived");
})

app.get('/info/hdi-stats', (req, res) => {
	res.send("<html><head><link rel='stylesheet' type='text/css' href='/css/hdi-stats.css'/></head><body><p>Tabla de HDI Source: <a href='http://hdr.undp.org/en'>here</a></p><table class='tableizer-table'><thead><tr class='tableizer-firstrow'><th>country</th><th>year</th><th>hdi-rank</th><th>hdi-value</th><th>hdi-scholar</th></tr></thead><tbody><tr><tr><td>Spain</td><td>2017</td><td>25</td><td>0.903</td><td>17.9</td></tr><tr><td>France</td><td>2017</td><td>26</td><td>0.897</td><td>15.5</td></tr><tr><td>Germany</td><td>2017</td><td>6</td><td>0.943</td><td>17.0</td></tr><tr><td>United Kingdom</td><td>2017</td><td>13</td><td>0.926</td><td>17.5</td></tr><tr><td>USA</td><td>2017</td><td>17</td><td>0.924</td><td>16.3</td></tr> </tbody></table> </body></html>");
console.log("New GET request to /info/mh-stats has arrived");
})

app.post('/hello', (req, res) => {
	res.send("<html><body><h1> Hello! From tiny express server!</h1></body></html>");
	console.log("New POST request to /hello has arrived");
})

app.get('/hello', (req, res) => {
        res.send("<html><body><h1> Hello! From tiny express server!</h1></body></html>");
        console.log("New GET request to /hello has arrived");
})

app.get("/",(request, response) => {
	response.send("<h1>Welcome to SOS2021-23</h1><br>" + cool());
	console.log("New request to / has arrived");
});

app.get("/cool",(request, response) => {
	response.send(hehe());
	console.log("New request to /cool has arrived");
});

// Inicializar el listener del servidor
app.listen(port, () => {
	console.log("Server is ready, listening on port " + port);
});
