'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define('Gallery', {
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.Gallery.belongsTo(models.Users, {
          foreignKey: 'user_id'
        });
      }
    }
  });
  return Gallery;
};