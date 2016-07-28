'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define('Gallery', {
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Gallery;
};