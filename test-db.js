// test-db.js

var db = require('./models');

db.sequelize.sync()
  .then(run)

  function run(){
    var photo = db.Gallery.findOne({
      include: [
      { model: db.Users }
      ]
    });
    photo.then(function(photo){
      console.log(photo);
      // console.log(photo.__prototype__);
      // photo.getUser()
      //   .then(function (user){
      //     console.log(user.username);
          // res.render('gallery', {
          //   username: user.username,
          //   url: gallery.url
          // });
        });
  }