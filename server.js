var express = require('express')
var path = require('path')
var app = express()

app.use('/public', express.static(path.join(__dirname, '/public')));
        
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

var port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log('listening on',port);
});
