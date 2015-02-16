var url = require('url');
var conMgr = require('./connectionManager.js');
var generalMethods = require('./generalMethods.js');

var requests = [];
var pendingNotifications = [];


function notifyAllClients(data) {
	var headers = {};
	var response;	
	headers["Access-Control-Allow-Origin"] = "*";
	headers["Content-Type"] = "text/plain";
	
	for (var i = 0; i < requests.length ; i++) {
		if (requests[i]!= null) {
		response = requests[i].res;		
		response.writeHead(200, headers);
		response.end(data, 'utf8');
		requests[i] =  null; 			
		}
	}
	 requests.length = 0;
};


function checkDBForNewEvents() {
	var results = {};
	var tblname = 'events';
	var sqlquery = 'SELECT * FROM ' + tblname + ';' ;	
	
	con = conMgr.getConnection();

	con.query(sqlquery, function(error, rows, fields) {
		
		for ( var i in rows) {
			results[i] = rows[i].eventname;	
		}
		results = JSON.stringify(results);
		notifyAllClients(results);
	});
};




exports.registerEvent = function createEvent(req, res) {

	var sqlquery = 'INSERT INTO events (eventname) VALUES ("New Event")';
	var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    console.log('Query Params' + JSON.stringify(query));

	con = conMgr.getConnection();

	con.query(sqlquery, function(error, rows, fields) {
	checkDBForNewEvents();
 	res.end('Done...');
	});
};




exports.eventStore = function saveEvent(req, res) {
	
	requests.push({			 
			res: res,
			timestamp: new Date().getTime()		
		});
};





exports.defaultnotification = function noeventsnotification() {

	var expiration = new Date().getTime() - 20000;
	var response;	
	for (var i = 0; i < requests.length ; i++) {
		if ( (requests[i]!= null)  && requests[i].timestamp < expiration) {
			response = requests[i].res;
			response.writeHead(200, { "Content-Type": "text/plain","access-control-allow-origin": "*" });
			response.end("No new events to display");
			requests[i] =  null; 		
		}
	}
};




exports.getUsersList = function getUsersList(req, res){
 
	var uuid = generalMethods.generateUUID();
	var sqlquery = 'SELECT fldname as name from tblusers';

	con = conMgr.getConnection();
	con.query(sqlquery,  function(error, results, fields) {

		if(error){

			console.log("Error Fetching ");
		}

	res.writeHead(200, { "Content-Type": "application/json","access-control-allow-origin": "*" });
	res.end(JSON.stringify(results));

 	});
};







exports.createUser = function createUser(req, res){

	console.log('create user request');

	var name = req.body.name;
	var uuid = generalMethods.generateUUID();
	var sqlquery = 'INSERT INTO tblusers (fldname, flduuid) VALUES (?, ?)';

	con = conMgr.getConnection();
	con.query(sqlquery, [name, uuid],  function(error, rows, fields) {

		if(error){

			console.log("Error inserting ");
		}
	
	res.writeHead(200, { "Content-Type": "application/json","access-control-allow-origin": "*" });
	res.end(JSON.stringify({ user_uuid: uuid }));
 	});
};







function getUserLocationFromPendingList(userid){

	var userLocation = -1;

	for(i =0; i < pendingNotifications.length; i++)	{

		if(userid == pendingNotifications[0].userid) {

			userLocation = i;
			break;
		}
	}

	return userLocation;
};






exports.manageNotifications = function manageNotifications(req, res){

	var userid  = req.body.userid;
	var data = req.body.message;
	var headers = {};
	var response;
	var userLive = false;
	var messages = [];
	var sqlquery = 'SELECT count(fldid) as COUNT FROM tblusers where flduuid = ?' ;	
	
	con = conMgr.getConnection();
	con.query(sqlquery, [userid], function(error, results) {

		if(1 == results[0].COUNT) {

			for (var i = 0; i < requests.length ; i++) {

				if (requests[i]!= null && requests[i].userid == userid) {
		
					userLive = true;
					headers["Access-Control-Allow-Origin"] = "*";
					headers["Content-Type"] = "application/json";
					response = requests[i].res;		
					response.writeHead(200, headers);
					response.end(data, 'utf8');
					requests[i] =  null; 			
				}
			}

			if(false == userLive){


				if(-1 > getUserLocationFromPendingList(userid))	{

					console.log('UserId is present in the List');

					messages.unshift(data);
					pendingNotifications.unshift({			
						"userid": userid,
						"messages": messages
					});

				}else{

					console.log('UserId is not present in the List');

					messages.unshift(data);
					pendingNotifications.unshift({			
						"userid": userid,
						"messages": messages
					});

				}
				
			}

	
			getUserLocationFromPendingList();

			res.writeHead(200, { "Content-Type": "text/plain","access-control-allow-origin": "*" });
			res.end('Done...');
			 	
		}
		else {

			res.writeHead(200, { "Content-Type": "application/json","access-control-allow-origin": "*" });
			res.end('Invalid user !!!');
		}	
	});





	
	// for (var i = 0; i < requests.length ; i++) {

	// 	if (requests[i]!= null && requests[i].userid == userid) {
		
	// 	userLive = true;
	// 	response = requests[i].res;		
	// 	response.writeHead(200, headers);
	// 	response.end(data, 'utf8');
	// 	requests[i] =  null; 			
	// 	}
	// }

	// if(false == userLive){

	// 	messages.unshift(data);
	// 	pendingNotifications.unshift({			
	// 			"userid": userid,
	// 			"messages": messages
	// 		});
	// }

	
	// getUserLocationFromPendingList();

	// res.writeHead(200, { "Content-Type": "text/plain","access-control-allow-origin": "*" });
	// res.end('Done...');
};


 
exports.addToPollersList = function addToPollersList(req, res) {
	
	var id = req.params.id;    	
	var sqlquery = 'SELECT count(fldid) as COUNT FROM tblusers where flduuid = ?' ;	
	con = conMgr.getConnection();
	con.query(sqlquery, [id], function(error, results) {

		if(1 == results[0].COUNT) {

			 requests.push({
			 userid : id,			 
			 res: res,
			 timestamp: new Date().getTime()	
			 });	
		}
		else {

			res.writeHead(200, { "Content-Type": "application/json","access-control-allow-origin": "*" });
			res.end('Invalid user !!!');
		}	
	});
};
