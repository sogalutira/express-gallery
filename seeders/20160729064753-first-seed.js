'use strict';
var faker = require('faker');
var galleryObj = [];
for (var i = 0; i < 7; i++){
  var galleryInfo = {
    author: faker.name.firstName(),
    url: faker.image.imageUrl(300,300,"cats") + '/' + Math.floor(Math.random()*11),
    description: faker.lorem.sentence(),
    createdAt : new Date(),
    updatedAt : new Date()
    };
  galleryObj.push(galleryInfo);
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Galleries', galleryObj, {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Galleries');
  }
};
