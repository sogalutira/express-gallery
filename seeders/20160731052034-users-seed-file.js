'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      username : 'Bob',
      password : 'secret',
      createdAt : new Date(),
      updatedAt : new Date()
    },{
      username: 'John',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      username: 'Jane',
      password: '123456',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Users', [{
      username :'Bob'
    },{
      username: 'John'
    },{
      username: 'Jane'
    }])
  }
};
