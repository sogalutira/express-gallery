'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Users.hasMany(models.Gallery, {
          foreignKey: 'user_id'
        });
      }
    }
  });
  return Users;
};

