const express = require('express');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');

/*
var mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://chatdb-azureelective:xT70G46xyrYMMpOaTnddsGdZrR9eZqXEBME2FsLx5nryQe1Pv9UzVGIQUmRpbMo8CmtZwcBErjShI6n7Faf2vw%3D%3D@chatdb-azureelective.documents.azure.com:10255/?ssl=true", function (err, client) {
  client.close();
});

*/

// app init
var app = express();

// Connection URL
const dbUrl = 'mongodb://localhost:27017';

// Database Name
const dbName = 'blackchad';

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

const server = require("http").Server(app);
let io = require("socket.io")(server); // has a list of all connected clients and manages them

var chat = [];

// connect to socket.io
io.on('connection', (socket) => {

    // Function to send status
    sendStatus = (s) => {
        socket.emit('status', s);
    }

    // emit messages to client
    socket.emit('output', chat);

    // handle input events
    socket.on('input', (data) => { // catch client socket input events
        console.log('Server chat message recieved');
        console.log(data);
        let name = data.name;
        let message = data.message;

        // check for name and message
        if (message == '') {
            sendStatus('Please enter message');
        } else {
            // insert message to chat variable
            chat.push({name: name, message: message});
            
            console.log('Message logged..');
            console.log(chat);

            io.emit('output', [data]);

            sendStatus({
                message: 'Message sent',
                clear: true
            });
        }
    });

    // handle clear
    socket.on('clear', (data) => {
        // Remove chat data from collection
            chat = [], () => {
            // Emit cleared msg
            socket.emit('Cleared chat');    
        }
    });
});

//mongoose.connect('mongodb://localhost/blackchad');
mongoose.connect("mongodb://chatdb-azureelective:xT70G46xyrYMMpOaTnddsGdZrR9eZqXEBME2FsLx5nryQe1Pv9UzVGIQUmRpbMo8CmtZwcBErjShI6n7Faf2vw%3D%3D@chatdb-azureelective.documents.azure.com:10255/?ssl=true&sslverifycertificate=false");
var db = mongoose.connection;

// Setting up view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Setup bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express session middleware
app.use(session({
    secret: 'chadisrad', // use to sign session ID cookie - newer version of express-session no longer needs cookie-parser middleware, if used can cause problems unless they use the same secret
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Connect flash middleware
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Setup request maps
app.use('/', routes); // / to routes (index)
app.use('/users', users); // /users to users


server.listen("3000", function(err) {
    if (err) {
        console.log(err);
    }
    console.log("Server started on port 3000")
});