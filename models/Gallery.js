module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("Gallery", {
    author: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Gallery;
};