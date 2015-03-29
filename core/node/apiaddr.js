var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiSchema = new Schema( {
	apikey : {type: String},
	macros : {}

}, {collection : 'api'});

apiSchema.methods.setMacro = function(macro, api) {
	this.macros[macro] = api;
}

apiSchema.methods.getMacro = function(macro) {
	return this.macros[macro];
}


module.exports = mongoose.model('Api', apiSchema);