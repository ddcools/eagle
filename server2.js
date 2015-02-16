var fs = require('fs');
var path = require('path');
var http = require('http2');

var options = process.env.HTTP2_PLAIN ? {
  plain: true
} : {
  key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
};


http.createServer(options, function(req, res) {

  res.end('Hello world');
  console.log('Server Up...'); 
}).listen(8081);