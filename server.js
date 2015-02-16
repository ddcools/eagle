
var express    = require('express'); 		 
var bodyParser = require('body-parser');
var http = require('http');
var app = express(); 				// define our app using express

var port = process.env.PORT || 8080; 		// set our port
var router = express.Router(); 				// get an instance of the express Router

var eventManager = require('./eventManager.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/eagle', router); // Attaching base name with the all the APIs


router.get('/test', function(req, res) {
	res.json({ message: 'My API !!!' });	
});


router.get('/', eventManager.eventStore);
router.get('/event', eventManager.registerEvent);
router.post('/addusers', eventManager.createUser);
router.get('/users', eventManager.getUsersList);


router.get('/users/:id', eventManager.addToPollersList);
router.post('/notifications', eventManager.manageNotifications); // For managing notifications



http.createServer(app).listen(port, function() {
  console.log('Server Up...');
});


setInterval(eventManager.defaultnotification, 30000);
