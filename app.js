var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');




var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//추가소스1
var server = require('http').Server(app);
var io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var config = {
    apiKey: "AIzaSyBJKZsuY9xVIcsN1glYF4BsrkkQsAOYXlg",
    authDomain: "tvtalk-c4d50.firebaseapp.com",
    databaseURL: "https://tvtalk-c4d50.firebaseio.com",
    storageBucket: "tvtalk-c4d50.appspot.com",
    messagingSenderId: "276781873007"
  };

// io.sockets.on('connection', function (socket) {
//   socket.on('check', function(msg) {
//       if(msg == 'tvtalk'){
//         io.emit('config', config);
//       }else{
//         io.emit('config', "fail");
//       }
//     });//socket.on

//   socket.on('chat', function(msg) {
//     if(msg != null){
//       socket.room = msg;
//       io.emit('config', config);
//       var ref = firebase.database().ref("chatInfo/"+msg);
//       ref.child("peopleCount").once("value", function(data){
//         if(data.val()== null){
//           var cnt = 1;
//         }else{
//           var cnt = parseInt(data.val())+1;
//         }

//         ref.child("peopleCount").set(cnt);
//       });
//     }else{
//       io.emit('config', "fail");
//     }
//   });

//   socket.on('disconnect', function(){
//     if(socket.room != null){
//       var ref = firebase.database().ref("chatInfo/"+socket.room);

//       ref.child("peopleCount").once("value", function(data){
//         var cnt = parseInt(data.val())-1;
//         ref.child("peopleCount").set(cnt);
//       });
//     }
//   });//disconnected

// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// server.listen(3000, function(){
//   console.log("sever start!");
// });


module.exports = app;
