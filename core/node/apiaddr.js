var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var apiSchema = new Schema( {
	apikey : {type: String},
	apimacros : {}

}, {collection : 'api'});

apiSchema.methods.setMacro = function(macro, api) {
	this.apimacros[macro] = api;
}

apiSchema.methods.getMacro = function(macro) {
	return this.apimacros[macro];
}

module.exports = mongoose.model('apiSchema', apiSchema);