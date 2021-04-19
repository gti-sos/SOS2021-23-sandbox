var BASE_API_PATH_SEC="/api/v1/du-stats";
const fs = require('fs');
var path = require('path');
var Datastore = require("nedb");
var dbFile = path.join(__dirname, 'du-stats.db');
var db = new Datastore({filename: dbFile,autoload:true});

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

var du_stats = [
    {
   "country": "Spain",
   "year": "2017",
   "dupopulation": "46,600,000",
   "dudead": "1.83",
   "dudependenceperc": "1.47",
   "dudaly": "249.83"
 },
 {
   "country": "France",
   "year": "2017",
   "dupopulation": "65,000,000",
   "dudead": "5.5",
   "dudependenceperc": "1.18",
   "dudaly": "254.95"
 },
 {
   "country": "Germany",
   "year": "2017",
   "dupopulation": "83,100,000",
   "dudead": "6.7",
   "dudependenceperc": "1.66",
   "dudaly": "241.92"
 },
 {
   "country": "United Kingdom",
   "year": "2017",
   "dupopulation": "66,200,000",
   "dudead": "6.98",
   "dudependenceperc": "1.66",
   "dudaly": "527.75"
 },
 {
   "country": "USA",
   "year": "2017",
   "dupopulation": "325,400,000",
   "dudead": "21.99",
   "dudependenceperc": "3.45",
   "dudaly": "1.695.55"
 },
 {
   "country": "Brazil",
   "year": "2017",
   "dupopulation": "207,900,000",
   "dudead": "5.5",
   "dudependenceperc": "1.06",
   "dudaly": "276.1"
 },
 {
  "country": "Mexico",
   "year": "2017",
   "dupopulation": "129,200,000",
   "dudead": "5.09",
   "dudependenceperc": "0.82",
   "dudaly": "248.29"
 },
 {
   "country": "Canada",
   "year": "2017",
   "dupopulation": "36,700,000",
   "dudead": "7.27",
   "dudependenceperc": "2.28",
   "dudaly": "756.15"
 },
 {
   "country": "Greenland",
   "year": "2017",
   "dupopulation": "56,000,000",
   "dudead": "13.93",
   "dudependenceperc": "1.99",
   "dudaly": "480.89"
 },
 {
  "country": "Italy",
   "year": "2017",
   "dupopulation": "60,500,000",
   "dudead": "1.19",
   "dudependenceperc": "1.15",
   "dudaly": "257.85"
 }
];

 module.exports.register = (app) => {
    //carga inicial de datos
	app.get(BASE_API_PATH_SEC  + "/loadInitialData", (req, res) => {
		db.insert(du_stats);
		console.log(`Initial data: <${JSON.stringify(du_stats, null, 2)}>`);
		res.sendStatus(200);
	});

    //GET a la lista de recursos
    app.get(BASE_API_PATH_SEC , (req, res) => {
	var limit = parseInt(req.query.limit);
	var offset = parseInt(req.query.offset);
	var search = {};

	if(req.query.country) 
		search["country"] = req.query.country;
	if(req.query.year) 
		search["year"] = parseInt(req.query.year);
	if(req.query.dupopulation) 
		search["dupopulation"] = req.query.dupopulation;
	if(req.query.dudead) 
		search["dudead"] = req.query.dudead;
	if(req.query.dudependenceperc) 
		search["dudependenceperc"] = req.query.dudependenceperc;
	if(req.query.dudaly) 
		search["dudaly"] = req.query.dudaly;

	db.find(search).skip(offset).limit(limit).exec((err,data)=>{
		if(err){
			console.error("ERROR accessing DB in GET");
			res.sendStatus(500);
		}else {
			if (data.length != 0){
				data.forEach((a)=>{delete a._id; }); 
				console.log(search)
				return res.send(JSON.stringify(data,null,2));
				return res.sendStatus(200);
			} else {
				console.log(search)
				console.log("No data found");
				return res.sendStatus(404);
			}
			

		}
	});
	});

    //POST a la lista de recursos
    app.post(BASE_API_PATH_SEC, (req, res) => {
		var newData = req.body;
        var country = req.body.country;
        var year = req.body.year; //lo tenemos pasado como string el valor, sino deberíamos usar un parseInt
        db.find({$and: [{country: newData.country}, {year: newData.year}]},

            (err, resources) =>{
                if(resources.length !=0){
                    console.log("El recurso ya existe");
                    res.sendStatus(409);
                }else if(!newData.country || !newData.year ||!newData.dupopulation||!newData.dudead || !newData.dudependenceperc || !newData.dudaly  ||Object.keys(newData).length != 6){
                        console.log("El número de campos no es el correcto");
                        res.sendStatus(400);
                }else{
                    console.log(`--CB API:\n  new resource <${newData.country}/${newData.year}> added`)
                    db.insert(newData);
                    res.status(201).json(newData);
                }

            }
        );
    });
	

    //GET a un recurso -- CODIGO NUEVO
    app.get(BASE_API_PATH_SEC + "/:country/:year", (req, res) => {
		var countryToGet = req.params.country;
		var yearToGet = req.params.year;
		
		
		db.find({country: countryToGet, year: yearToGet}, function(err, duInDB){
		console.log("Searching "+countryToGet+" "+yearToGet);
			if(err) {
				console.error(err);
				res.sendStatus(404);
			}
			if(duInDB.length==0){
				console.log("Resource not found: "+countryToGet+" "+yearToGet);
				res.sendStatus(404); // NOT FOUND
			}else{
				console.log(duInDB);
				var duToSend = duInDB.map((c)=>{
					return {country : c.country, year : c.year, dupopulation : c.dupopulation, dudead : c.dudead, dudependenceperc : c.dudependenceperc, dudaly : c.dudaly};
				});
				res.send(JSON.stringify(duToSend,null,2));
			}
			
		})
	});

    //DELETE a un recurso -- POSIBLE CODIGO NUEVO (probar cuando haga el post nuevo)
    app.delete(BASE_API_PATH_SEC + "/:country/:year", (req,res) => {

			
			var countryToDelete = req.params.country;
			var yearToDelete = req.params.year;
			
			db.remove({country: countryToDelete, year: yearToDelete},{},(err, data)=>{
				if(err){
					console.error("ERROR deleting the resource in DELETE: "+err);
					res.sendStatus(500);
				}else{
					if(data==0){
						console.log("No data found to delete");
						res.sendStatus(404); // NOT FOUND
					}else{
						res.sendStatus(200); // OK
					}
				}
			})
			
	
		});

    //PUT a un recurso
	app.put(BASE_API_PATH_SEC + "/:country/:year", (req, res) => {
	
		var country = req.params.country;
		var year = req.params.year;
		var updateddu = req.body;
		var query = {"country":country, "year":year};
	
		if (!updateddu.country 
			|| !updateddu.year 
			|| !updateddu['dupopulation'] 
			|| !updateddu['dudead'] 
			|| !updateddu['dudependenceperc'] 
			|| !updateddu['dudaly'] 
			|| country != updateddu.country 
			|| year != updateddu.year
			|| Object.keys(updateddu).length != 6){
	
			console.log("Missing any field");
			return res.sendStatus(400);
		} 
		else {
			db.update(query,updateddu,(err,data) =>{
				if(err){
					console.error("ERROR accesing DB in PUT");
					res.sendStatus(500);
				}
				else{
					if(data == 0){
						res.sendStatus(404);
						console.log("No data in the database");
					}
					else{
						res.sendStatus(200);
						console.log("Resource updated");
					}
				}
			});
		}
	});
		
	


    //POST a un recurso
    app.post(BASE_API_PATH_SEC + "/:country/:year", (req,res) => {
    	console.log ("Unable to POST to a specific resource");
    	return res.sendStatus(405);
    });
    //PUT a una lista de recursos
    app.put(BASE_API_PATH_SEC, (req,res) => {
    	console.log("Unable to PUT to a list of resources");
    	return res.sendStatus(405);
    });

      //DELETE a una lista de recursos -- EL CODIGO NUEVO ES EL COMENTADO
    app.delete(BASE_API_PATH_SEC, (req,res) => {
	  db.remove({},{multi: true},(err, numDuRemoved)=>{
		  if(err){
			  console.error("ERROR deleting DB evictions: "+err);
			  res.sendStatus(500);
		  }else{
			  if(numDuRemoved==0){
				  res.sendStatus(404);
			  }else{
				  console.log("Resources deleted");
				  res.sendStatus(200);
			  }
		  }
	  })
    });
 };