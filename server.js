var express = require('express');
var pug = require('pug');
var querystring = require('querystring');
var path = require('path');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

var db = require('./models');
var Gallery = db.Gallery;

var locals = bodyParser.urlencoded({ extended: false });

// var Gallery = require('./Gallery');

app.use(morgan('dev'));
app.use(locals);
app.use(bodyParser.json());
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

// app.get('/', function(req, res){
//   var galleryJSON = require('./data/gallery');
//   res.render('index', {galleries: galleryJSON});
// });

app.get('/', function(req, res){
    Gallery.findAll()
  .then(function (gallery){
    res.render('index', {galleries: gallery});
  });
});


// // app.get('/gallery/:id', function(req, res){
//   app.get('/gallery/:id(\\d+)/', function (req, res){
//     var idObj = [];
//     var galleryJSON = require('./data/gallery');
//     var id = req.params.id;
//     console.log('gallery stuff: ', galleryJSON[id]);
//     var theIds = idObj.push(galleryJSON[id]);
//     console.log('line 29');
//     console.log(theIds);

//     res.render('singlegallery', {galleries: theIds});
//     // res.send('gallery id: ' + req.params.id);
// });

app.get('/gallery/:id', function(req, res){
  Gallery.findOne({
    where: { id: req.params.id}
  })
  .then(function (gallery){
    res.render('singlegallery', {gallery: gallery});
    // res.json(gallery);
  });
});

app.get('/gallery/new', function(req, res){
  res.render('gallery');
  // res.send('New gallery');
});

// app.post('/gallery', locals, function(req, res){
//     Gallery.create(req.body, function (err, result){
//       console.log(req.body);
//       if (err){
//         throw err;
//       }
//       res.render('gallery', req.body);
//     });
// });

app.post('/gallery', function(req, res){
    Gallery.create({ author: req.body.author, url: req.body.url, description: req.body.description })
  .then(function (gallery) {
    res.render('gallery', gallery);
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
  db.sequelize.sync();
});