var express = require('express');
var pug = require('pug');
var querystring = require('querystring');
var path = require('path');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var db = require('./models');
var Gallery = db.Gallery;
var locals = bodyParser.urlencoded({ extended: false });

app.use(morgan('dev'));
app.use(locals);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, "public")));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

// var user = { username: 'bob', password: 'secret', email: 'bob@example.com' };

passport.use(new LocalStrategy(
  function(username, password, done) {
    // var USERNAME = CONFIG.CONFIG.USERNAME;
    // var PASSWORD = CONFIG.CONFIG.PASSWORD;
    // if (username === user.username && password === user.password){
    //   return done(null, {});
    Users.findOne({where: {username: username}})
    .then(function(user){
      if(user){
        return done(null, user);
      }
  });
}));

app.use(passport.initialize());
app.use(passport.session());

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
  .then(function (Gallery){
    res.render('index', {Gallery: Gallery});
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local',
  {successRedirect: '/secret',
  failureRedirect: '/login'
}));

app.get('/secret', function(req, res){
  res.render('secret');
});

app.get('/gallery/new', passport.authenticate('local', {session:false}), function(req, res){
  console.log(req.user);
  res.render('gallery');
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

app.get('/gallery', function(req, res){
  res.redirect('/');
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
    }
  })
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