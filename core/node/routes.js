var express = require('express');
var apiaddr = require('./apiaddr.js');
var apisequence = require('./apimodules/api-sequence.js');
var api = require('./apimodules/api.js');
var bodyparser = require('body-parser');

var app = express();
//app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));
//app.use(bodyparser);

/* Begin routing */
app.get('/:api(\\w+)/:macro(\\w+)/:vars([\/,\\w]*)', function(req, res) {
	console.log(req.params.api + " " + req.params.macro + " " + req.params.vars);
	/* Create json from the url provided */
	apiaddr.findOne({'apikey':req.params.api}, function(err, result) {
		console.log(result);
		console.log(req.params.macro);
		var macro = result.getMacro(req.params.macro);
		var vars = req.params.vars.split('\/');
		/* Replace all of the variables and call in sequence */
		for (var i = 0; i < macro.varSchema.length; i++) {
			for (var j = 0; j < macro.varSchema[i].length; j++) {
				if(macro.varSchema[i][j].match(/\$get\((\d+)\)/)){
					macro.varSchema[i][j] = vars[parseInt(macro.varSchema[i][j].replace(/\$get\((\d+)\)/, "$1"))];
				}
			}
		}
		console.log(macro.varSchema);
		var apis = macro["apis"];
		var apiArray = [];

		for (var i = 0; i < apis.length; i++){
			apiArray.push(api(apis[i].api, apis[i].resSchema));
		}

		console.log(apiArray);

		var as = apisequence(apiArray, macro.varSchema, function(data) {
			res.write("{");
			for(var i = 0; i < data.apis.length; i++){
				res.write("response" + i + ":" + JSON.stringify(data.apis[i].response) + ",");
			}
			res.end("}");
		});
		as.execute();

	});
});

app.get('/update', function(req, res) {
	if(req.params.apikey){
		console.log(req.params.apikey + " " + req.params.macro);
	}
	res.render('update');
	res.end();
});

app.post('/update', function(req, res) {
	console.log("Body Key: " + req.body.apikey);
	var key = req.body.apikey;
	var macro = req.body.macro;
	var apis = req.body.apis; // "'google.com','as;dklfjaslkdjfl'"

	console.log(key + " " + macro);

	/* this is where shit starts breaking */
	//apis = apis.split(',');



	/* Create new macros */
	apiaddr.findOne({'apikey':key}, function(err, result) {
		if (result) {
			var macros = result.macros;
			console.log(macros);
			macros[macro] = {};

			apiaddr.update({'apikey':key},{'$set' : {'macros' : macros}}, function(err) {
				if (err) handleError(err);
			});
		}
	});

	res.end();
});
/* End routing */

module.exports = app;