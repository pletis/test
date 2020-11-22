var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var session = require('express-session')
var FileStore = require('session-file-store')(session)




app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());

app.use(session({
  name: 'mysession',
  secret: '111111',
  resave: false,
  saveUninitialized: true,

}))

var authData = {
  email: 'tjswk70000@naver.com',
  password: '111111',
  nickname: 'pletis'
}


var passport = require('passport') , 
LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log("serializeUser", user);
  done(null, user.email);
});

passport.deserializeUser(function (id, done) {
  console.log('deserializeUser', id)
  done(null, authData);
});





passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done){
    if(username === authData.email){
      if(password === authData.password){
        return done(null, authData);
      } else {
        return done(null, false, {
          message: 'Incorrect password'
        });
      }
    } else {
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }
));

app.post('/auth/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  }));

app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist;
    next();
  });
});

var indexRouter = require('./router/index');
var topicRouter = require('./router/topic');
var authRouter = require('./router/auth');
const auth = require('./lib/auth');
  
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);


app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
})

app.use(function (err, req, res, next){
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));