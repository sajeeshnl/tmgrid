// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                        // create our app w/ express
    var mongoose = require('mongoose');              // mongoose for mongodb
    var morgan   = require('morgan');                // log requests to the console (express4)
    var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var database = require('./config/database');
    var port     = process.env.PORT || 8888;
    var path = require('path');
 
    var passport = require('passport');
    var cookieParser = require('cookie-parser');
   
        
    mongoose.Promise = Promise;  
    //app.set('views', path.join(__dirname, 'public'));
  
   
   


    // configuration ===============================================================
    mongoose.connect(database.url);     // connect to mongoDB database on modulus.io
   

             require('./app/passport')(passport);
    app.use(express.static(__dirname + '/public'));       
    
   
              // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    
           var expressSession = require('express-session');
            app.use(cookieParser());
// TODO - Why Do we need this key ?
              app.use(expressSession({secret: 'mySecretKey'}));
             
 
             app.use(passport.initialize());
             app.use(passport.session());

    // routes ======================================================================
           require('./app/routes.js')(app,passport);

     
    
    // listen (start app with node server.js) ======================================
    app.listen(port);
    console.log("App listening on port : " + port);


