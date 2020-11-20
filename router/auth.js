var express = require('express');
var router = express.Router();
var template = require('../lib/template');

var authData = {
  email: 'tjswk70000@naver.com',
  password: '111111',
  nickname: 'pletis'
}

router.get('/login', (request, response) => {
  var title = 'WEB - create';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="password" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  response.send(html);

});

router.post('/login_process',function(request,response){
  var post = request.body;
  var email = post.email;
  var password = post.password;
  if(email === authData.email && password === authData.password){
      request.session.is_logined = true;
      request.session.nickname = authData.nickname;
      request.session.save(function(){
        response.redirect('/');
      });
      
  }else{
      response.send('WHO?');
      }
})

router.get('/logout', (request, response) => {
  request.session.destroy(function(err){
    response.redirect('/');
  })
});

module.exports = router;