require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
const session = require('express-session');
const port = 3300;
 var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const corsOptions = {
  origin: ["https://happychild-topaz.vercel.app", "https://appychild.uk", "http://localhost:5173"],
};

app.use(session({
  secret: 'happychild12334mother',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 } // Optional: Set session expiration time
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// API Routes
app.use('/backend/api/v1', indexRouter);
app.use('/backend/users', usersRouter);

// Error handling
app.use((req, res) => {
  res.status(404).send('404: Page Not Found');
});
// Serve static files for React app
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = app;
