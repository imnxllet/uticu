var express = require('express');
var router = express.Router();
var User = require('./user.js');
var passport = require('passport');
var session = require('express-session');
require('../config/passport.js')(passport)

router.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));

/*Get home page.*/
router.get('/', isLoggedIn, function(req, res){
  res.redirect('/home');
});



/*Login Button request*/
router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: true
	}));


/*Sign up request*/
router.post('/signup', isLoggedIn, function(req, res){
	User.findOne({'member.email': req.body.email}, function(err, user){
	if(err){
		throw err;
		return;
	}
	if(user){
		console.log("Member exist in the system!");
		req.flash('signupMessage1', 'That email already taken');
		res.redirect("/new");
		return;
	} else {
		User.count({}, function( err, count){
	    	console.log( "Number of users:", count);

	    	var newUser = new User();
			newUser.member.ID = count;
			newUser.member.name = req.body.name;
			newUser.member.email = req.body.email;
			newUser.member.number = req.body.number;
			newUser.member.card16_17 = req.body.card;
			newUser.member.year = req.body.year;
			newUser.member.program = req.body.program;
			newUser.member.stdnum = req.body.stdnum;

			
			newUser.save(function(err){
				if(err)
					throw err;
				return;
			});
	        
	        console.log("New member saved!");
			req.flash('signupMessage', 'New member saved in system!');
			res.redirect("/new");
    
		});
	}
	})
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/' }));


/*Get home page*/
router.get('/home', isLoggedIn, function(req, res){
	/*if(req.user.username == "admin@fastline.com"){
		res.render('admin.html', { user: req.user, message: ""});
	}else if(!req.user.truck.name){
		res.render('index.html', { user: req.user });
	}else{
		res.render('seller-home.html', { user: req.user });
	}*/
	res.render('index.html', { user: req.user });
});
 //res.send('Username '+ username+ ' password '+ password);

router.get('/search', isLoggedIn, function(req, res){
	/*if(req.user.username == "admin@fastline.com"){
		res.render('admin.html', { user: req.user, message: ""});
	}else if(!req.user.truck.name){
		res.render('index.html', { user: req.user });
	}else{
		res.render('seller-home.html', { user: req.user });
	}*/
	res.render('search.html', { user: req.user });
});
/*logout request*/
router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

/*Profile page*/
router.get('/new', isLoggedIn, function(req, res){
		res.render('register.html',{user: req.user, message: req.flash('signupMessage'),message1: req.flash('signupMessage1')});
	});

router.get('/show/:year', isLoggedIn, function(req, res){
	var year = req.params.year;
	if(year == 1415){
		User.find({'member.card14_15': {$exists: true,$ne: ""}},function(err, members) {
	      if (err) {
	        res.status(500).send(err);
	        console.log(err);
	        return;
	      }
		      //console.log(trucks);
		      //console.log(req.params.id);
		      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members), year: year});
		   });
		
	}else if(year == 1516){
				User.find({'member.card15_16': {$exists: true,$ne: ""}},function(err, members) {
	      if (err) {
	        res.status(500).send(err);
	        console.log(err);
	        return;
	      }
		      //console.log(trucks);
		      //console.log(req.params.id);
		      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members),year: year});
		   });
		

	}else{
				User.find({'member.card16_17': {$exists: true,$ne: ""}},function(err, members) {
	      if (err) {
	        res.status(500).send(err);
	        console.log(err);
	        return;
	      }
		      //console.log(trucks);
		      //console.log(req.params.id);
		      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members),year: year});
		   });
		

	}
	});

router.post('/searchname', isLoggedIn, function(req, res){
	var name = capitalizeFirstLetter(req.body.name);
		User.find({'member.name': { "$regex": name,$options:'i'}},function(err, members) {
	      if (err) {
	        res.status(500).send(err);
	        console.log(err);
	        return;
	      }
		      //console.log(trucks);
		      //console.log(req.params.id);
		      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members), year: "Resulting"});
		   });
});

router.post('/searchyear', isLoggedIn, function(req, res){
	var year = req.body.year;
		User.find({'member.year': { "$regex": year}},function(err, members) {
	      if (err) {
	        res.status(500).send(err);
	        console.log(err);
	        return;
	      }
		      //console.log(trucks);
		      //console.log(req.params.id);
		      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members), year: "Resulting"});
		   });
});

router.post('/searchprogram', isLoggedIn, function(req, res){
	var program = capitalizeFirstLetter(req.body.program);
		User.find({'member.program': { "$regex": program}},function(err, members) {
	      if (err) {
	        res.status(500).send(err);
	        console.log(err);
	        return;
	      }
		      //console.log(trucks);
		      //console.log(req.params.id);
		      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members), year: "Resulting"});
		   });
});
/*get edit page*/
router.get('/members/:id/edit', isLoggedIn, function(req, res){
	var id= req.params.id;
   User.findOne({'member.ID': id}, function(err, member) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }

    // If the book is not found, we return 404.
    if (!member) {
      res.status(404).send('Not found.');
      return;
    }

    // If found, we return the info.
    //console.log(truck); 
    res.render('update.html', { user: req.user, member:member, Message: req.flash('Message')});
  });


	});



/*Update request for seller*/
router.post('/update', isLoggedIn, function(req, res){
	var id = req.body.id;
	 User.findOne({'member.ID': id}, function(err, member) {
	    if (err) {
	      res.status(500).send(err);
	      console.log(err);
	      return;
	    }

    // If the book is not found, we return 404.
	    if (!member) {
	      res.status(404).send('Not found.');
	      return;
	    }

		member.member.email = req.body.email;
		member.member.number = req.body.number;
		member.member.card14_15 = req.body.card14_15;
		member.member.card15_16 = req.body.card15_16;
		member.member.card16_17 = req.body.card16_17;
		member.member.year = req.body.year;
		member.member.program = req.body.program;
		member.member.stdnum = req.body.stdnum;
		member.save(function(err){
		if(err)
			throw err;
		return;
		});
		
		console.log('user modified!');
		req.flash('Message', 'Member\'s information is updated and saved!');
    	res.redirect('/members/' + id + '/edit');
  	});
});



router.get('/logo.png', function(req, res){
	res.render("logo.png");
});
router.get('/bg.JPG', function(req, res){
	res.render("bg.JPG");
});

router.get('/allemails', isLoggedIn, function(req, res){
	//Find all books.
	User.find({'member.email': {$exists: true}},function(err, members) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      //console.log(trucks);
      //console.log(req.params.id);
      res.render('allemailsphones.html', { user: req.user, members: turnTruckstoHtmlList(members), year: "Emails"});
   });

});
router.get('/allphones', isLoggedIn, function(req, res){
	//Find all books.
	User.find({'member.number': {$exists: true}},function(err, members) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      //console.log(trucks);
      //console.log(req.params.id);
      res.render('allemailsphones.html', { user: req.user, members: turnTruckstoHtmlList(members), year: "Phones"});
   });
		
});
/*Get all the sellers*/
router.get('/allmembers', isLoggedIn, function(req, res){
	//Find all books.
	User.find({'member.name': {$exists: true}},function(err, members) {
      if (err) {
        res.status(500).send(err);
        console.log(err);
        return;
      }
      //console.log(trucks);
      //console.log(req.params.id);
      res.render('allmembers.html', { user: req.user, members: turnTruckstoHtmlList(members), year: "All"});
   });
		
});

/*Get seller's menu*/
router.get('/members/:id', isLoggedIn, function(req, res){
   var id= req.params.id;
   User.findOne({'member.ID': id}, function(err, member) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
      return;
    }

    // If the book is not found, we return 404.
    if (!member) {
      res.status(404).send('Not found.');
      return;
    }

    // If found, we return the info.
    //console.log(truck); 
    res.render('profile.html', { user: req.user, member:member, message: req.flash('Message')});
  });
});



/*check if user log in*/
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		console.log('is logged in!');
		//res.redirect('/home');
		return next();
	}
    console.log('is not logged in!');

	res.render('login.html', { message: req.flash('loginMessage')});
}
function compare(x, y) {
	nameA = x.member.name;
	nameB = y.member.name;

 if (nameA < nameB) //sort string ascending
  return -1;
 if (nameA > nameB)
  return 1;
 return 0; //default return value (no sorting)

}


function turnTruckstoHtmlList(trucklist){

    //console.log(trucklist.length);
    var result = [];
    for(i=0;i<trucklist.length;i++){
       result.push(trucklist[i]);
    }
    return result.sort(compare);
  }

/*capitalize the first letter of string (from stackoverflow
	http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript)*/
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
module.exports = router;

