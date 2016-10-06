var mongoose = require('mongoose');
var Schema = mongoose.Schema;
old_member = require("../icumembership.json");
//var bcrypt = require('bcrypt');

mongoose.connect('mongodb://uticu2014:uticu2014@ds025180.mlab.com:25180/uticu');
/*mongoose.connect('localhost:27017/uticu_test4', {
  user: '',
  pass: ''
});*/
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Connected to MongoDB');
});


var userSchema = new Schema({
  member:  {
        "ID": Number,
        "card14_15": String,
        "card15_16": String,
        "card16_17": String,
        "name": String,
        "year": String,
        "program": String,
        "email": String,
        "number": String,
        "stdnum": Number},
  facebook: {
    id: String,
  },
  exec:{name: String, username: String, password: String}
});



/*userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}*/

userSchema.methods.validPassword = function(password){
  if(!this.exec.password){
    return false;
  }
  
  if(this.exec.password == password){
    return true;
  }else{
    return false;
  }
  //return bcrypt.compareSync(password, this.password);
}



var User = mongoose.model('User', userSchema);



  /*made admin account*/
  
  User.findOne({"exec.username": "uticu2014@gmail.com"},function(err, user) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      if(!user){
        var admin = new User();
          admin.exec.username = 'uticu';
          admin.exec.password = 'uticu';
          //admin.truck.name = 'mi';


          admin.save(function (err) {
              if (err) {
                console.log(err);
                return;
              }});

          console.log('Admin save!');
      }else{
        console.log('Admin already created in db!');
        return;
      }
  });

 User.findOne({"member.ID": "1"},function(err, user) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      if(!user){
      for(i=0; i<old_member.length; i++){
        var member = new User();
            member.member.name = old_member[i].name;
    member.member.email = old_member[i].email;
     member.member.number= old_member[i].number;
    member.member.card14_15= old_member[i].card14_15;
    member.member.card15_16 = old_member[i].card15_16;
    member.member.card16_17 = old_member[i].card16_17;
    member.member.year = old_member[i].year;
    member.member.program = old_member[i].program;
    member.member.stdnum = old_member[i].stdnum;
    member.member.ID = old_member[i].ID;

console.log(member.member.ID);
          member.save(function (err) {
              if (err) {
                console.log(err);
                return;
              }});
     }
          console.log('Loaded old members!');
          
              	User.count({}, function(err, c) {
           console.log('Count is ' + c);
      });
              

      }else{
        console.log('Old members are already in DB!');
        return;
      }
  });


module.exports = User;