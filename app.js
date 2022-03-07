const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Expose-Headers", "Content-Disposition")
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static("uploads"));

var authenticationRouter = require('./routes/authentication');
var registrationRouter = require('./routes/registration');
var friendRequestRouter = require('./routes/friendRequest');
var friendRouter = require('./routes/friend');
var chatRouter = require('./routes/chat');
var userRouter = require('./routes/user');
var uploadRouter = require('./routes/upload');

app.use('/authentication', authenticationRouter);
app.use('/registration', registrationRouter);
app.use('/friendRequest', friendRequestRouter);
app.use('/friend', friendRouter);
app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/upload', uploadRouter);

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  return res.status(500)
            .json({
              error: "An error has occured on the server. Please try again later."
            });
});

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
