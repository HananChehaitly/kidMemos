'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Memory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Memory.init({
    parent_id: DataTypes.INTEGER,
    kid_id: DataTypes.INTEGER,
    picture_url: DataTypes.STRING,
    content: DataTypes.STRING,
    title: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Memory',
  });
  return Memory;
};