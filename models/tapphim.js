'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TapPhims extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TapPhims.belongsTo(models.Phims, { foreignKey: 'phim_id', onDelete: 'CASCADE' });
    }
  }
  TapPhims.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ten_tap_phim: DataTypes.STRING,
    ten_dia_chi_tap: DataTypes.STRING,
    ten_tep_phim: DataTypes.STRING,
    duong_dan_nhung_phim: DataTypes.STRING,
    duong_dan_truc_tuyen: DataTypes.STRING,
    phim_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TapPhims',
  });
  return TapPhims;
};