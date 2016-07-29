var express = require('express');
var pug = require('pug');
var querystring = require('querystring');
var path = require('path');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = require('./models');
var Gallery = db.Gallery;

var locals = bodyParser.urlencoded({ extended: false });

// var Gallery = require('./Gallery');

app.use(morgan('dev'));
app.use(locals);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res){
    Gallery.findAll()
  .then(function (gallery){
    res.render('index', {galleries: gallery});
  });
});

app.get('/gallery/new', function(req, res){
  res.render('gallery');
  // res.send('New gallery');
});

app.get('/gallery/:id', function(req, res){
  Gallery.findOne({
    where: { id: req.params.id}
  })
  .then(function (gallery){
    res.render('singlegallery', {gallery: gallery});
  });
});

app.get('/gallery/:id/edit', function(req, res){
    Gallery.findOne({
      where: { id: req.params.id}
    })
    .then(function (edit){
      res.render('editgallery', {gallery: edit});
    });
});

app.post('/gallery', function(req, res, next){
  Gallery.create({
    author: req.body.author,
    url: req.body.url,
    description: req.body.description
  })
  .then(function (gallery) {
    res.render('singlegallery', {gallery: gallery});
  });
});

app.put('/gallery/:id', function(req, res){
  Gallery.update( {
    author: req.body.author,
    url: req.body.url,
    description: req.body.description
  }, {
    where: {
      id: req.params.id
    }} )
  .then(function(){
     return Gallery.findOne({
      where: {
        id: req.params.id
      }
    });
  })
  .then(function (update){
    res.render('singlegallery', {gallery: update});
    // res.redirect('singlegallery');
  });
});

app.delete('/gallery/:id', function (req, res){
  Gallery.destroy({
    where: {
      id: req.params.id
    },
    truncate: true})
  .then(function(Gallery){
    res.redirect('/');
  });
});

var server = app.listen(8080, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening on: ', host, port);
  db.sequelize.sync();
});