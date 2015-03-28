var http = require('http');
var mongo = require('mongoose');
var apiaddr = require('./apiaddr.js');
var user = require('./user.js');
var express = require('express');

var mongoose = mongo.connect('mongodb://localhost:27017/data');


/* start */

http.createServer(function (req, res) {
    /*
     * Take the request and return the json associated with the request
     */
    console.log(require('url').parse(req.url).pathname.split('/'));
   

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');