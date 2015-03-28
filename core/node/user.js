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

userSchema.methods.generateHash = function(password) {
	var user = this;
	bcrypt.genSalt(8, function(err, encrypted) {
		if (err) {
			System.log(err);
		}

		bcrypt.hash(password, encrypted, function(userpass) {
			user.password = userpass;
		});
	});
}

userSchema.methods.validPassword = function(password) {
	bcrypt.compareSync(password, this.password);
}