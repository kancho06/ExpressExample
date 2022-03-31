var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);


app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨.');


    // req헤더에 User-Agent값과 req파람의 ?name=mike 파라미터에 값을 변수에 담았다.
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;

    res.send('<h3>서버에서 응답. User-Agent: ' + userAgent + 
    '</h3><h3>Param Name -> ' + paramName + '</h3>');
});



var sever = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('express로 웹 서버를 실행함 : ' + app.get('port'));
});