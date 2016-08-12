var bodyParser = require('body-parser');
var express = require('express');
var methodOverride = require('method-override');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var pug = require('pug');
var querystring = require('querystring');
var session = require('express-session');
var redis = require('connect-redis');

var RedisStore = redis(session);
var LocalStrategy = require('passport-local').Strategy;
var app = express();

var db = require('./models');
var Gallery = db.Gallery;
var Users = db.Users;
var locals = bodyParser.urlencoded({ extended: false });

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(locals);
app.use(morgan('dev'));

app.use(session({
  store: new RedisStore(),
  secret: 'keyboardcat',
  resave: true,
  saveUninitilized: false
}));


// passport.deserializeUser(function(id, done){
//   Users.findById(id, function(err, user){
//     done(err, user);
//   });
// });

// function authenticate(username, password){
//   Users.findOne({
//     where: {
//       username: username,
//       password: password
//     }
//   })
//   .then(function(user){
//     if(user){
//       return done(null, user);
//     }
//   });
// }

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    Users.findOne({
      where: {
        username: username,
        password: password
      }
    })
    .then(function(user){
      if (user === null) {
        return done(null, false);
      }
      // console.log(username);
      // console.log(password);
      // if (!(username === user.username && password === user.password)){
      //   console.log('after if statement false');
      //   return done(null, false);
      // }
      return done(null, user); // kicks off serializeUser
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(userId, done) {
  return Users.findById(userId)
    .then(function(user){
      return done(null, user);
    })
    .catch(function(err){
      return done(err);
    });
  });
//   Users.findOne({
//     where: {
//       id: userId
//     }
//   })
//   .then(function(user) {
//     done(null, user);
//   });
// });

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// app.get('/secret', function(req, res){
//   res.render('secret');
// });

app.get('/', function(req, res){
  Gallery.findAll()
  .then(function (Gallery){
    res.render('index', {Gallery: Gallery});
  });
});

app.get('/gallery', function(req, res){
  res.redirect('/');
});

app.get('/gallery/new', isAuthenticated, function(req, res){
  res.render('gallery');
});

app.get('/gallery/:id', function(req, res){
  Gallery.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(function (gallery){
    res.render('singlegallery', {gallery: gallery});
  });
});

app.get('/gallery/:id/edit', isAuthenticated, function(req, res){
    Gallery.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function (edit){
      res.render('editgallery', {gallery: edit});
    });
});

// app.post('/login', function(req, res) {
//   console.log("entered the app.post method");
// });

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
  Gallery.update({
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

app.delete('/gallery/:id', isAuthenticated, function (req, res){
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

function isAuthenticated (req, res, next) {
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  return next();
}

