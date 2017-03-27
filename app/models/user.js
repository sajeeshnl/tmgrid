

// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost/");
 
autoIncrement.initialize(connection);                            

var userSchema = mongoose.Schema({
    user: {type: Number, ref: 'User'},
    username: String,
    password: String
  });
  
  userSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'userId' });

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

    
module.exports = mongoose.model('User',userSchema);