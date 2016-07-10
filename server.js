var express = require('express');
var pug = require('pug');
var querystring = require('querystring');
var path = require('path');
var app = express();

var Gallery = require('./Gallery');

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
  res.render('index');
  // response.send('List of gallery photos');
});

// app.get('/gallery/:id', function(req, res){
  app.get('/gallery/:id(\\d+)/', function (req, res){
  res.send('gallery id: ' + req.params.id);
});

app.get('/gallery/new', function(req, res){

  res.send('New gallery');
});

  app.post('/gallery', function(req, res){
    req.on('data', function(data){
      var locals = querystring.parse(data.toString());
      Gallery.create(locals, function (err, result){
        if (err){
          throw err;
        }
        res.render('gallery', locals);
      });
    });
  });

// app.post('/gallery', function(req, res){
//   req.on('data', function(data){
//     var sentData = data.toString();
//     var reqData = querystring.parse(sentData);
//     console.log('Gallery req: ', reqData);
//   });
// });

app.get('/gallery/:id/edit', function(req, res){

});


var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening on: ', host, port);
});