var express = require('express');
var apiaddr = require('./apiaddr.js');
var apisequence = require('./apimodules/api-sequence.js');
var api = require('./apimodules/api.js');
var bodyparser = require('body-parser');
var User = require('./user.js');

var app = express();

//app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));

/* Begin routing */

app.get('/:macro([a-zA-Z0-9]+)/:vars(*+)', function(req, res) {
	console.log(req.params.api + " " + req.params.macro + " " + req.params.vars);
	/* Create json from the url provided */
	var macro = require('./macros/' + req.params.macro + '.js');
    macro(req, res);
    res.end();
    delete require.cache[require.resolve('./macros/' + req.params.macro + '.js')];
});

/* End routing */

module.exports = app;