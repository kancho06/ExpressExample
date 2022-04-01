var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');

// 쿠키 파서
var cookieParser = require('cookie-parser');



var app = express();

app.set('port', process.env.PORT || 3000);

app.use('/public', static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//쿠키파서 미들웨어 사용
app.use(cookieParser());


var router = express.Router();

// 응답객체에 cookie();라는 함수를 사용할 수 있다. (모듈)
router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie : 라우팅 함수 호출됨');

    res.cookie('user', {
        id : 'mike',
        name : '소녀시대',
        authorized : true
    });

    res.redirect('/process/showCookie');
});


router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie : 라우팅 함수 호출됨')

    // 이 cookies에는 유저정보가 들어가있다.
    res.send(req.cookies);
});


router.route('/process/login').post(function (req, res) {
    console.log('/process/login : 라우팅 함수에서 받음');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.write('<h1>서버에서 로그인 응답</h1>');
    res.write('<div><p>' + paramId +'</p></div>');
    res.write('<div><p>' + paramPassword +'</p></div>');
    res.end();
});


var errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use('/', router);


var server = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('server listening on : ' + app.get('port'));
})
