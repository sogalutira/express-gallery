var express = require('express');
var pug = require('pug');
var querystring = require('querystring');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

var Gallery = require('./Gallery');

var pics = './data/gallery.json';


app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());

app.get('/', function(req, res){

  res.render('index');

});

// app.get('/gallery/:id', function(req, res){
  app.get('/gallery/:id(\\d+)/', function (req, res){

    // res.send('gallery id: ' + req.params.id);
});

app.get('/gallery/new', function(req, res){
  res.render('gallery');
  // res.send('New gallery');
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



app.get('/gallery/:id/edit', function(req, res){

});

app.put('/gallery/:id/', function(req, res){

});

app.delete('/gallery/:id', function (req, res){

});


var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening on: ', host, port);
});