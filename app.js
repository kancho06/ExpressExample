var express = require('express');
var http = require('http');

var app = express();

// 포트정보설정
// PORT라고 하는 환경변수가 설정되어있지 않으면 3000포트를 'port' 라는 속성에 담아라
app.set('port', process.env.PORT || 3000);

// app을 파라미터로 넘겨줌으로서 express모듈을 사용
var server = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('express로 웹 서버를 실행함 : ' + app.get('port'));
});


