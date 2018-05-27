"use strict";
//run database connection to establish connection to Database
require("./api/data/dbConnection.js");
//Initialize express app and setup all packages needed to run express app in browser
const express 				= require('express');
// initialize express app
const app 					= express();
const bodyParser 			= require('body-parser');
const compression 			= require('compression');
const path 					= require('path');
const sanitizer 			= require('express-sanitizer');
const cookieParser 			= require('cookie-parser');
const session 				= require('express-session');
const mongoStore			= require('connect-mongo')(session);
const helmet 				= require('helmet');
const flash 				= require('express-flash');
const mongoose 				= require('mongoose');
const moment 				= require('moment');
const morgan 				= require('morgan');
const httpServer 			= require('http').Server(app);
const io 					= require('socket.io')(httpServer);
const socketEvents 			= require('./api/data/websocketChat')(io, app);
const ejs 					= require('ejs');
const engine				= require('ejs-mate');
const favicon 				= require('serve-favicon');
//Routes 
//Client routes
const indexRoutes 			= require('./api/client/routes/');

app.use(compression());
app.use(helmet());
app.engine('ejs', engine);
app.set('view-engine', 'ejs');
//set port and ip
app.set("port", process.env.PORT || 3000);
app.set("ip", process.env.IP || "0.0.0.0");
//Headers
//app.disable('x-powered-by');
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  if ('OPTIONS' == req.method) {
     res.sendStatus(200);
  } else {
     next();
  }
});
//Set up static folder
app.use(express.static(path.join(__dirname + "/public"), {maxAge: 240000}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(sanitizer());
app.use(cookieParser(process.env.KRYPTO_KEY));
//Session setup
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	store: new mongoStore({ mongooseConnection: mongoose.connection}),
	cookie: { maxAge: 360 * 60 * 1000}
}));

app.use(csrf({ cookie: { signed: true } }));
app.use(flash());
//app.use(csrf({cookie: true}));
// You can set morgan to log differently depending on your environment
if (app.get('env') == 'Websiteion') {
  app.use(morgan('common', { skip: function(req, res) {
    return res.statusCode < 400 }, stream: __dirname + '/../morgan.log'}));
} else {
  app.use(morgan('dev'));
}
require("moment/min/locales.min");
moment.locale('ru');
app.locals.moment = moment;
//Local variables
app.use(function(req, res, next) {
	res.cookie('_csrfToken', req.csrfToken());
	res.locals.session = req.session;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
//Use routes
// client routes
app.use("/", indexRoutes);

// admin routes

//Start server
let server = httpServer.listen(app.get("port"), app.get('ip'), (err) => {
	if(err) {
		res.status(500).send(err+" Palvelinta ei voitu käynnistää, teknisen vian vuoksi.");
	} else {
		let port = server.address().port;
		console.log("Rolling Records startattu palvelimella: "+port);
	}
});
