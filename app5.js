var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

// 리다이렉트 기능
app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨.');

    res.redirect('http://google.com');
});



var sever = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('express로 웹 서버를 실행함 : ' + app.get('port'));
});