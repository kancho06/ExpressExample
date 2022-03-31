var express = require('express');
var http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('첫번째 미들웨어 호출됨.')
    req.user = 'mike'
    
    next();
});

app.use(function(req, res, next) {
    console.log('두번째 미들웨어 호출됨.')

    // res.writeHead(200, {"Content-type":"text/html;charset=utf-8"});
    // res.end('<h1>서버에서 응답한 결과 입니다 : ' + req.user + '</h1>');

    // send 를 이용하면 더욱 간단하게 리스폰스를 보낼 수 있다.
    // res.send('<h1>서버에서 응답한 결과 입니다 : ' + req.user + '</h1>');

    // 객체를 보내게 되면 JSON포멧으로 넘어간다.
    var person = {name: '소녀시대', age: 20};
    // res.send(person);

    // 위에 결과와 똑같은 JSON포멧으로 넘어가는것을 봐서 자동으로 포멧을 변경해주는것을 알 수 있다.
    // var personStr = JSON.stringify(person);
    // res.send(personStr);

    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(person);
    res.end();
});



var server = http.createServer(app).listen(app.get('port'), function() 
{
    console.log('express로 웹 서버를 실행함 : ' + app.get('port'));
});

