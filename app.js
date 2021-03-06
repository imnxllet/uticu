var express = require('express');
var app = express();
//var expressValidator = require('express-validator')
var login = require('./routes/login.js');
// set views path, template engine and default layout

var passport = require('passport');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var express = require('express');
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/view');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(morgan('dev'));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
//serve static file.
app.use(express.static('public/images'));
app.use(express.static('public'));
app.use('/favicon.ico', express.static('images/favicon.ico'));
/*var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(expressValidator());*/ // this line must be immediately after express.bodyParser()!

app.set('port', (process.env.PORT || 3000));
//get the index page
app.use('/', login);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


