var express = require('express')
var path = require('path')
var app = express()

app.use('/public', express.static(path.join(__dirname, '/public')));
        
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

var port = parseInt(process.env.PORT) || 1337;

app.listen(port, function () {
    console.log('listening on',port);
});
