var express = require('express');
var router = express.Router();

var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "tvtalk-8c33492c8bba.json",
  databaseURL: "https://tvtalk-c4d50.firebaseio.com/"
});

var db = firebase.database();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/main', function(req, res, next) {
  res.render('home');
});

router.get('/list/:dramakey', function(req, res, next) {
  res.render('list', {key : req.params.dramakey, title : req.params.title});
});

router.get('/chatroom', function(req, res, next) {

  if(req.query.drama !=null && req.query.order !=null){
    var ref = db.ref("drama/"+req.query.drama+"/list/"+req.query.order+"/state");
    ref.once("value", function(data){
      if(data.val() == 'open'){
        res.render('chatroom',{key : req.query.drama, title : req.query.order});
      }else{
        res.send('<script>alert("채팅방이 존재하지 않습니다."); history.back();</script>');
      }
    });
  }
  else{
    res.render('error');
  }
});

router.get('/closed', function(req, res, next) {

  if(req.query.drama!=null && req.query.order !=null){
    var ref = db.ref("drama/"+req.query.drama+"/list/"+req.query.order+"/state");
    ref.once("value" ,function(data){
      if(data.val() == 'closed'){

        db.ref("chat/"+req.query.drama+"_"+req.query.order).once("value", function(d){
          var max = 0;
          var cnt = 0;
          d.forEach(function(d2) {

            cnt++;
            if(d2.child("like").numChildren() > max){
              max = d2.child("like").numChildren();
            }
            if(cnt == d.numChildren()) {

              res.render('chatroom_lock',{key : req.query.drama, title : req.query.order, max : max});

            }

          });
        });

      }else{
        res.send('<script>alert("채팅방이 존재하지 않습니다."); history.back();</script>');
      }
    });
  }
  else{
    res.render('error');
  }
});

router.get('/login/:back', function(req, res, next) {
  res.render('login', {back : req.params.back});
});

router.get('/logout', function(req, res, next) {
  res.render('logout');
});

router.get('/join/:back', function(req, res, next) {
  res.render('join', {back : req.params.back});
});

router.get('/findpw', function(req, res, next) {
  res.render('findpw');
});

router.get('/user', function(req, res, next) {
  res.render('user_info');
});

router.get('/nickname_change', function(req, res, next) {
  res.render('nickname_change');
});

router.get('/pwd_change', function(req, res, next) {
  res.render('pwd_change');
});

router.get('/apk', function(req, res, next) {
  res.render('apk');
});

module.exports = router;
