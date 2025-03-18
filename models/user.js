'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      // Quan hệ nhiều-nhiều với bảng Phim thông qua bảng YeuThich
      Users.belongsToMany(models.Phims, { 
        through: 'YeuThich',  // Thêm bảng trung gian
        foreignKey: 'nguoi_dung_id', 
        onDelete: 'CASCADE' 
      });
    }
  }

  Users.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
  }, {
    sequelize,
    modelName: 'Users',
  });

  return Users;
};
