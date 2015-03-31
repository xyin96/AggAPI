var http = require('http');
var apiaddr = require('./apiaddr.js');
var user = require('./user.js');
var Api = require('./apimodules/api.js');
var ApiSequence = require('./apimodules/api-sequence.js');
var app = require('./routes.js');

http.createServer(app).listen(1337, '0.0.0.0');

console.log('Server running at http://127.0.0.1:1337/');
