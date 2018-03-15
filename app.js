'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var app = express();
var fs = require('fs');

app.use(bodyParser.json());


app.Global = {
    GUID: require('./Modules/GUID')()
};

app.get(ServicePath('/initserver'), function (req, res) {
    var rstream = fs.createReadStream('./init.js');
    rstream.pipe(res);
});

app.get(ServicePath('/getsocketkey'), function (req, res) {
    var _valid = false;
    if(req.query.id) _valid = true;
    return res.json({ key: _valid ? app.Global.GUID.Generate(req.param.id) : "Unable to create GUID" });
});

app.get(ServicePath('/getclientip'), function (req, res) {
    return res.json({ YourIP: app.Global.GUID.GetClientIP(req) });
});


function ServicePath(path) {
    return process.env.base_path + path;
}

module.exports = app;
