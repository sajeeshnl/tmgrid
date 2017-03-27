// app/routes.js

// load the todo model
var Todo = require('./models/todo');
var User = require('./models/user');

// expose the routes to our app with module.exports
module.exports = function(app,passport) {




    app.get('/', function(req, res) {
        res.render('home.html'); // load the index.ejs file
    });

    // api ---------------------------------------------------------------------
    // get all todos
     /*app.post('/api/users', function(req, res) {
      // create a todo, information comes from AJAX request from Angular
       //User.create({
            //text : req.body.text,
            //}, function(err, user) {
            //if (err)
               // res.send(err);
        

            // get and return all the todos after you create another
            //User.find(function(err, users) {
                //if (err)
                   // res.send(err)
                //res.json(users);
            //}); 
        //});    

          
       User.create({text : req.body.text})
        .then(User.find())
        .then(function(users) {console.log("users:"+ req.body.text);res.json(users);})
        .catch(function (err) {res.send(err)}) 
      });*/
      
      app.post('/api/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/todos', // redirect to the secure profile section
        failureRedirect : '/api/login' // redirect back to the signup page if there is an error
      }));  
      
      app.post('/api/login', passport.authenticate('local-login', {
        successRedirect : '/api/todos', // redirect to the secure profile section
        failureRedirect : '/api/login' // redirect back to the signup page if there is an error
      }));
    
    app.get('/api/todos', isLoggedIn,function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {
       
        // create a todo, information comes from AJAX request from Angular
        /*Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });*/
        
         Todo.create({text : req.body.text,done:false})
         .then(function(data){return Todo.find().exec()})
        .then(function(todos) {res.json(todos);})
        .catch(function (err) {res.send(err)}) 
        
        

    });
  
    app.get('/api/logout', function(request, response) {
    console.log("inside logou")
		request.logout();
		response.redirect('/');
	});
    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        /*Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });*/
         
         Todo.remove({_id : req.params.todo_id})
         .then(function(data){
          return Todo.find().exec()})
          .then(function(todos) {res.json(todos);})
         .catch(function (err) {res.send(err)}) 
        
      
    });
    
    function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
    console.log("authenticated")
        return next();
    }
    else{
      console.log("not authenticated")
    res.redirect('/');
    }

    // if they aren't redirect them to the home page
    
    
}
    
    
    
    
};