
var mysql = require('mysql');
var conf = require('./config.js');

exports.getConnection = function dbconnection() {

	con = mysql.createConnection({
		host: conf.dbcredentials.hostname,
  		user: conf.dbcredentials.dbuser,
  		password: conf.dbcredentials.dbpassword,  
  		database: conf.dbcredentials.dbname
	});

	con.connect(function(err) {
		if (err) {
			console.log('error when connecting to db:', err);
		}
	});

	return con;
}