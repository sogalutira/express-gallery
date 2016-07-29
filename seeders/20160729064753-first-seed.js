'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Galleries', [{
      author : 'John',
      url : 'http://lorempixel.com/400/200/',
      description : 'I am a new user to this application',
      createdAt : new Date(),
      updatedAt : new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Galleries', [{
      author :'John'
    }])
  }
};
