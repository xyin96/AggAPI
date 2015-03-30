var express = require('express');
var apiaddr = require('./apiaddr.js');
var apisequence = require('./apimodules/api-sequence.js');
var api = require('./apimodules/api.js');
var bodyparser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./user.js');

var app = express();


passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with username
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with username and password from our form
		// find a user whose username is the same as the forms username
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'username_lower' :  username.toLowerCase() }, function(err, user) {
        	console.log(user.apikey);
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

/* Begin routing */
app.get('/:api([\$a-zA-Z0-9.]+)/:macro([a-zA-Z0-9]+)/:vars(*+)', function(req, res) {
	console.log(req.params.api + " " + req.params.macro + " " + req.params.vars);
	/* Create json from the url provided */
	var macro = require('./macros/' + req.params.macro + '.js');
    macro(req, res);
    delete require.cache[require.resolve('./macros/' + req.params.macro + '.js')];
});

app.get('/update/:key(*+)', function(req, res) {
	res.render('update', {key:req.params.key});
	res.end();
});

app.get('/findmacro/:key([\$a-zA-Z0-9.]+)/:macro(\\w+)', function(req, res){
	console.log(req.params.key + " " + req.params.macro);
	apiaddr.findOne({'apikey' : req.params.key}, function(err, result) {
		if (result.macros[req.params.macro]) {
			console.log(result.macros[req.params.macro]);
			res.end(JSON.stringify(result.macros[req.params.macro]));
		}
	});
})

app.post('/update', function(req, res) {
	var key = req.body.apikey;
	var macro = req.body.macro;
	var apis = req.body.apis; // "'google.com','as;dklfjaslkdjfl'"
	console.log(key);

	/* Create new macros */
	apiaddr.findOne({'apikey':key}, function(err, result) {
		console.log(result);
		if(result){
			if (err) handleError(err);

			var macros = result.macros;
			macros[macro] = {'name' : macro };
			macros[macro].varSchema = [];
			for (var i = 0; i < req.body.varSchema.length; i++) {
				macros[macro].varSchema.push(req.body.varSchema[i].split(','));
			}
			macros[macro].apis = [];
			macros[macro].apis = req.body.apis;

			if (result) {
				apiaddr.update({'apikey':key},{'$set' : {'macros' : macros}}, function(err) {
					if (err) handleError(err);
				});
			}
		} else {
			/* make new api thingy */
			var macros = {};
			macros[macro] = {'name' : macro };
			macros[macro].varSchema = [];
			for (var i = 0; i < req.body.varSchema.length; i++) {
				macros[macro].varSchema.push(req.body.varSchema[i].split(','));
			}
			macros[macro].apis = req.body.apis;

			var newapi = new apiaddr({'apikey' : key, 'macros' : macros});

			newapi.save(function(err) {
				if (err) System.log(err);
			});
		}
	});

	res.end();
});

app.get('/signup', function(req, res) {
	res.render('signup');
	res.end();
}); 

app.post('/signup', function(req, res) {
	var user = req.body.username;
	var password = req.body.password;
	console.log(password);
	var passwordCheck = req.body.passwordCheck;
	console.log(user + "signed up");
	console.log(passwordCheck);
	User.findOne({'username_lower' : user.toLowerCase()}, function(result){
		if (!result) {
			var userModel = new User({'username': user, 'username_lower': user.toLowerCase()});

			if (password === passwordCheck) {
				userModel.generateKey(user);
				userModel.setPassword(password);
				userModel.save(function(err){
					console.log("saved");
					if (err) {
						return handleError(err);
					}
					res.redirect('/login');
				});
			} else {
				res.redirect('/signup');
				res.end();
			}
		}
	});
});

app.get('/login', function(req, res) {
	isNotLoggedIn(req, res, function(){
		res.render('login');
		console.log("hi");
		res.end();
	});
	//res.redirect('/update');
});

app.post('/login', passport.authenticate('local-login', {failureRedirect: '/login'}), function(req, res) {
	console.log(req);
	res.redirect('/update/' + req.user.apikey);

});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    next();

} 

function isNotLoggedIn(req, res, next) {
  // if user is not authenticated in the session, carry on 
  	if (!req.isAuthenticated()) {
    	next();
	} else {
	  // if they aren't redirect them to the home page
	  	res.redirect('/update/' + req.getSession());
	}
} 

/* End routing */

module.exports = app;