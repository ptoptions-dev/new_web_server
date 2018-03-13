'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var app = express();

app.use(bodyParser.json());
    
module.exports = app;
