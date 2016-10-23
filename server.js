var express = require('express')
var path = require('path')
var app = express()




app.listen(1337, function () {
    console.log('The server is listening on port 1337!');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});
