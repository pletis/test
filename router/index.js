var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');



router.get('/', function(request,response){

    console.log('/', request.user);
    var title = '안녕 나는 노르웨이숲이야';
    var description = '접근을 원하시면 로그인을 하세요';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}<h2>${description}
      <img src ="/images/cat.jpg" style = "width:700px; display:block; margin-top:10px">
      `,
      `<a href="/topic/create">create</a>`,
      auth.StatusUI(request,response)
      );
      response.send(html);
  });

  module.exports = router;