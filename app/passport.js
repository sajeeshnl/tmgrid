
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
        done(null, user.id);
   });

    // used to deserialize the user
  passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
  passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  
  function(req, username, password, done) {
         console.log("user:"+username+ ".............."+password) 
        User.findOne({ 'username' :  username }).exec()
          .then(function(user) {
      
            // check to see if theres already a user with that email
            if (user) {
                console.log("Already exists");
                return done(null, false);
            } else {

                // if there is no user with that email
                // create the user
                /*var newUser = new User();

                // set the user's local credentials
                //newUser.local.username    = username;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                return newUser.save()
                .then(function(){
                console.log("success");
                });*/
                User.create({username : req.body.username,password : req.body.password})
                .then(User.find().exec())
                .then(function(user) {
                console.log("users:"+ req.body.username);
                return done(null, user);
                })
                .catch(function (err) { 
                console.log("catch of create");
                return done(null, false);
                }); 
            }
        })   
       .catch(function(err){
       console.log("catch of last");
          done(err);
       });
    }));
    
  passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  
  function(req, username, password, done) {
        console.log("username:"+username);
          console.log("password:"+password);
        User.findOne({ 'username' :  username }).exec()
          .then(function(user) {
            // check to see if theres already a user with that email
            if (user) {
            console.log("there is a user")
            
             if (user.password != password){
               console.log("pwd:"+password);
                console.log("inalid password");
                return done(null, false);
               }
            else
             return done(null, user);
        
            } else {
                // if there is no user with that email
                console.log("Not exists");
                return done(null,false);
           
            }
          })   
       .catch(function(err){
       console.log("catch of login:"+err);
          done(err);
       });
    }));
  };
  
  
  
  
  
