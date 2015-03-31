var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema(
{
	username : String,
	username_lower : String,
	password : String,
	apikey : String
}, {collection: 'usercollection'});

userSchema.methods.generateHash = function(string) {
	// Hash the password with the salt
	var hash = bcrypt.hashSync(string, this.apikey);
	// console.log(hash);
	return hash;
}

userSchema.methods.setPassword = function(password){
	this.password = this.generateHash(password);
}

userSchema.methods.generateKey = function(string, callback) {
	this.apikey = bcrypt.genSaltSync(8);

}

userSchema.methods.validPassword = function(password) {
	var that = this;
	 console.log(this.generateHash(password) + " " +  this.password);
	// console.log(this.generateHash(password) + " " +  this.password);
	// console.log(this.generateHash(password) + " " +  this.password);
	// console.log(this.generateHash(password) + " " +  this.password);
	return this.generateHash(password) == this.password;
}

module.exports = mongoose.model('user', userSchema);