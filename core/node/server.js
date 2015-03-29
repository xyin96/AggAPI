var http = require('http');
var mongo = require('mongoose');
var apiaddr = require('./apiaddr.js');
var user = require('./user.js');
var Api = require('./apimodules/api.js');
var ApiSequence = require('./apimodules/api-sequence.js');

var mongoose = mongo.connect('mongodb://localhost:27017/AGGAPI');

var app = require('./routes.js');

http.createServer(app).listen(1337, '127.0.0.1');

// http.createServer(function (req, res) {
    
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     console.log(req.headers);
//     console.log(require('url').parse(req.url));
    
//     var $ip = Api(["http://www.telize.com/geoip/$()"], [{lat:"latitude", lon:"longitude"}]);
//     var $a = Api(["http://api.openweathermap.org/data/2.5/weather?lat=$()&lon=$()", 
//                       "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"],
//                      [{temp:"main.temp",weather:"weather[0].main"}, // return schema name:"location in original api response"
//                       {"*":null}]);
//     $a.test();
//     var seq = [$ip, $a];
//     var $as = ApiSequence(seq, [["54.84.241.99"], ["$(response[0].lat)","$(response[0].lon)"]], function(data){
//         console.log(data.response[1].weather);
//     });
//     $as.execute(); 


// }).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
