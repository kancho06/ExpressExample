var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');
var expressErrorHandler = require('express-error-handler');

// 쿠키 파서
var cookieParser = require('cookie-parser');
// 세션
var expressSession = require('express-session');

// 파일업로드 multer, fs
var multer = require('multer');
var fs = require('fs');

// CORS(다중 서버 접속) -> ajax 등으로 요청할 때
var cors = require('cors');



var app = express();

app.set('port', process.env.PORT || 3000);

app.use('/public', static(path.join(__dirname, 'public')));

// 파일 업로드 미들웨어
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//쿠키파서 미들웨어 사용
app.use(cookieParser());
// 세션
app.use(expressSession({
    secret : 'my key', 
    resave : true,
    saveUninitialized : true
}));


app.use(cors());

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads');
    },
    filename : function(req, file, callback) {
        // 확장자만 담는다.
        var extension = path.extname(file.originalname);
        // 확장자만 뺀 나머지 이름을 변수에 담는다.
        var basename = path.basename(file.originalname, extension);
        // 파일 중복되지 않도록 저장 시 이름 설정
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({
    storage : storage,
    limits : {
        files : 10,
        fileSize : 1024  * 1024 * 1024
    }
});


var router = express.Router();

// upload.array 에 두번째 파라미터는 업로드 갯수를 이야기한다.
router.route('/process/photo').post(upload.array('photo', 1), 
function (req, res) {
    console.log('/process/photo : 라우팅 함수 호출됨');

    var files = req.files;
    console.log('==== 업로드된 파일 ====');
    if (files.length > 0) {
        console.dir(files[0]);
    } else {
        console.log('파일이 없습니다.')
    }

    var originalname;
    var filename;
    var mimetype;
    var size;
    
    //배열 확인하기
    if (Array.isArray(files)) {
        for(var i = 0; i < files.length; i++) {
            originalname = files[i].originalname;
            filename = files[i].filename;
            mimetype = files[i].mimetype;
            size = files[i].size;
        }
    }

    console.log('파일 정보 : ' + originalname + ', ' + filename 
    + ', ' + mimetype + ', ' + size);

    res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    res.write("<h1>파일 업로드 성공</h1>");
    res.write("<p>원본파일 : " + originalname + "</p>");
    res.write("<p>저장파일 : " + filename+ "</p>");
    res.end();
});

// 세션 

router.route('/process/product').get(function(req, res) {
    console.log('/process/product : 라우팅 함수 호출됨');

    if (req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login2.html?');
    }
});

// 로그인
router.route('/process/login').post(function(req, res) {
    console.log('/process/login : 라우팅 함수 호출됨')

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

    if  (req.session.user) {
        console.log('이미 로그인되어 있습니다.');
        res.redirect('/public/product.html');
    } else {
        req.session.user = {
            id : paramId,
            name : 'aespa',
            authorized : true
        };

        res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<p>Id : ' + paramId + '</p>');
        res.write('<br><br><a href="/process/product">상품페이지로 이동하기</a>');
        res.end();
    }

});


// 로그아웃
router.route('/process/logout').get(function(req, res) {
    console.log('/process/logout : 라우팅 함수 호출됨');

    if (req.session.user) {
        console.log('로그아웃 합니다.');

        req.session.destroy(function(err) {
            if (err) {
                console.log('세션 삭제 시 에러 발생')
                return;
            }

            console.log('세션 삭제 성공')
            res.redirect('/public/login2.html?');
        });
    } else {
        console.log('로그인되어 있지 않습니다.');
        res.redirect('/public/login2.html?');
    }

})



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
});
