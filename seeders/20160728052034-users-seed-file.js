'use strict';
var faker = require('faker');
var userObj = [];
for(var i = 0; i < 8; i++){
  var userInfo = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    createdAt : new Date(),
    updatedAt : new Date()
  };
  userObj.push(userInfo);
}

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', userObj, {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users');
  }
};
