var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
var indexRouter = require('./routes/index');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopoly: true,
  useNewUrlParser: true,
});
var db = mongoose.connection;

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', _ => {
  console.log('Conectado com o banco');
});

module.exports = app;
