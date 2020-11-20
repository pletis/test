var express = require('express')
var app = express()
var fs = require('fs');
var { request, response } = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var { constants } = require('buffer');
var helmet = require('helmet');
var session = require('express-session')
var FileStore = require('session-file-store')(session)



app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(helmet());


app.get('*',function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});


var indexRouter = require('./router/index');
var topicRouter = require('./router/topic');
var authRouter = require('./router/auth');

app.use(session({
  secure: true,
  secret: 'dsfdsfdsfdsfdsf',
  resave: false,
  saveUninitialized: true,
  store:new FileStore(),
}))


app.use('/',indexRouter);
app.use('/topic',topicRouter);
app.use('/auth',authRouter);


app.use(function(req,res,next){
  res.status(404).send('Sorry cant find that!');
})

app.use(function (err, req, res, next){
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));