const express = require('express')
const app = express()
const PORT = 3000;
const HOST = '0.0.0.0';

const multer = require('multer'); //for file uploading to db
const mongoose = require('mongoose');// for database connection
const bodyParser= require('body-parser')//for parsing data
const fs = require('fs');//for filesystem

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://mongo:27017/testdb', { useNewUrlParser : true}).then(() => {
console.log("Connected as container to Database")
}).catch((err) => {
  console.log("Could not connect as container", err);
  //try connecting through localhost
  console.log("Trying to connect to localhost")
  mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser : true}).then(() => {
  console.log("Connected to Database as localhost");
  }).catch((err) =>
  {
    //try connecting through localhost
    console.log("Not Connected to Database ERROR! ", err);
  });
});

/*app.get('/login/:username/:password', function(req,res){
  //Check that username exists

  //check that password matches

  //Send respons of login
});*/



/*var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  dob: String,
  shirtsize: String,
  pantsize: String,
  gender: String,
  town: String,
  zipcode: String

}, {timestamps: true});

mongoose.model('User', UserSchema);*/


//Email Validation
var Schema = mongoose.Schema;
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var userSchema = new Schema({
  full_name: { type: String,  required: [true, 'Full name must be provided'] },
  username: { type: String,  required: [true, 'Username name must be provided'] },
  email:    {

    type: String,
    Required:  'Email address cannot be left blank.',

    validate: [validateEmail, 'Please fill a valid email address'],
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    index: {unique: true, dropDups: true}

    },
  shirtsize: { type: String , required: [true,  'Shirtsize cannot be left blank']},
  pantsize: { type: String , required: [true,  'Pantsize cannot be left blank']},
  dob: { type: Date , required: [true, 'Date of birth must be provided']},
  town: { type: String , required: [true, 'Town cannot be left blank.']},
  gender: { type: String , required: [true, 'Gender must be provided']},
  zipcode: { type: String , required: [true, 'Zipcode must be provided']}

});

Users = mongoose.model('Users', userSchema);

Schema = mongoose.Schema,
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10,
// these values can be whatever you want - we're defaulting to a
// max of 5 attempts, resulting in a 2 hour lock
MAX_LOGIN_ATTEMPTS = 5,
LOCK_TIME = 2 * 60 * 60 * 1000;

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

UserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // set the hashed password back on our user document
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

var User = mongoose.model('User', UserSchema);

//---------------------------------------------------------------------------------------

//Get username from url
//check for availability
//Get Json data and store password and username in userdb
//Get rest of Json file (contains see board) store into user info (including username)
/*app.post('/newUser/:username', function(req, res) {
  newUser = req.params.username;
  console.log("Username is set to " + req.params.username + "Password is set to " + req.params.password)
  res.send("Username is set to " + req.params.username + "Password is set to " + req.params.password);

  //Check for username availability
  User.findOne({ username:  newUser}, function (err, finding) {
    if(err) return handlError(err);

    console.log(finding.username);

  });*/
  /*
  var newUser = new User({
      username: req.params.username,
      password: req.params.password
  });
  */

  //res.redirect('/server');


// save user to database
/*testUser.save(function(err) {
    if (err) throw err;

    // attempt to authenticate user
    User.getAuthenticated('jmar777', 'Password123', function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
          console.log(user);
            // handle login success
            console.log('login success');
            return;
        }else {
          console.log("SHIT DIDT WORK")
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });
});
*/
app.get('/login/:username/:password', function(req,res){
  user = req.params.username;
  password = req.params.password;
  console.log(user);
  User.getAuthenticated(user, password, function(err, user, reason) {
      if (err) throw err;

      // login was successful if we have a user
      if (user) {
        console.log(user);
          // handle login success
          console.log('login success');
          res.sendStatus(200);
          return;
      }else {
        console.log("SHIT DIDT WORK")
      }

      // otherwise we can determine why we failed
      var reasons = User.failedLogin;
      switch (reason) {
          case reasons.NOT_FOUND:
          case reasons.PASSWORD_INCORRECT:
              // note: these cases are usually treated the same - don't tell
              // the user *why* the login failed, only that it did
              break;
          case reasons.MAX_ATTEMPTS:
              // send email or otherwise notify user that account is
              // temporarily locked
              break;
      }
  });
});

app.post('/newUser/:username/:password', function(req,res){
  user = req.params.username;
  password = req.params.password;


  var newUser = new User({
      username: user,
      password: password
  });
  user = req.params.username;
  password = req.params.password;
  newUser.save(function(err){
    if (err) throw err;
    res.sendStatus(200);

    // attempt to authenticate user
    /*
    User.getAuthenticated(this.username, this., function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
          console.log(user);
            // handle login success
            console.log('login success');
            return;
        }else {
          console.log("SHIT DIDT WORK")
        }

        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });*/
  })
});

app.get('/', (req, res) => res.send('Hello World!'))



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
