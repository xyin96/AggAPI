var express = require('express');
var apiaddr = require('./apiaddr.js');
var apisequence = require('./apimodules/api-sequence.js');
var api = require('./apimodules/api.js');

var app = express();

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
			console.log(data.response[1].weather);
		});
		as.execute();

	});
});
/* End routing */

module.exports = app;