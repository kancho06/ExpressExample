var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
// bodyParser는 외장모듈이기 때문에 설치해야한다.
var bodyParser = require('body-parser');


var app = express();

app.set('port', process.env.PORT || 3000);

// public 이라는 경로를 static 권한으로 열어둠
// 브라우저에서 요청시 img, css, html등을 꺼내서 쓸 수 있다.
// 요청패스는 /public 이고 총 주소는 localhost:3000/public/images/image.png
// /public 패스는 생략하는 것이 편하다. ex) /images/image.png
// 이건 GET 방식
app.use('/public', static(path.join(__dirname, 'public')));

// 이건 POST 방식
// POST 는 헤더가 아니라 바디에 넣기 때문에 bodyParser를 쓴다.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨.');


    // req헤더에 User-Agent값과 req파람의 ?name=mike 파라미터에 값을 변수에 담았다.
    var userAgent = req.header('User-Agent');
    // 이건 GET 방식
    // var paramName = req.query.name;
    // 이건 POST 방식 (|| 붙인 이유는 만약 body에 없다면 쿼리를 봐라 라는 뜻)
    var paramId = req.body.id || req.query.id;


    res.send('<h3>서버에서 응답. User-Agent: ' + userAgent + 
    '</h3><h3>Param Name -> ' + paramId + '</h3>');
});



var sever = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('express로 웹 서버를 실행함 : ' + app.get('port'));
});