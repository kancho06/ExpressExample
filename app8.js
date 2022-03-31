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


// routing function 
var router = express.Router();
// middleware 처럼 모든 요청을 받는 것이 아닌 특정 패스의 요청만 받는다.
router.route('/process/login').post(function (req, res) {
    console.log('/process/login 라우팅 함수에서 받음.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.write("<h1>서버에서 로그인 응답</h1>");
    res.write("<div><p>" + paramId + "</p></div>");
    res.write("<div><p>" + paramPassword + "</p></div>");
    res.end();
});


app.all('*', function(req, res) {
    res.status(404).send('<h1>요청하신 페이지는 없습니다.</h1>');
});



app.use('/', router);





var server = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('express로 웹 서버를 실행함 : ' + app.get('port'));
});

