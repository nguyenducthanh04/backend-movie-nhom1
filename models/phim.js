'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class phims extends Model {
    static associate(models) {
      // Quan hệ 1-N với bảng TapPhim
      phims.hasMany(models.tapphims, { foreignKey: 'phim_id', onDelete: 'CASCADE' });

      // Quan hệ N-N với User qua bảng trung gian YeuThich
      phims.belongsToMany(models.User, { 
        through: 'YeuThich',  
        foreignKey: 'phim_id',  
        onDelete: 'CASCADE' 
      });
      // Quan hệ N-1 với DanhMuc
      phims.belongsTo(models.danhmucs, { 
        foreignKey: 'danh_muc_id', 
        as: 'danhMuc',  // Alias để tránh xung đột
        onDelete: 'CASCADE' 
      });
    }
  }

  phims.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ten_phim: DataTypes.STRING,
    ten_dia_chi_phim: DataTypes.STRING,
    the_loai: DataTypes.STRING,
    danh_muc_id: DataTypes.INTEGER,
    anh_nen_phim: DataTypes.STRING,
    anh_poster_phim: DataTypes.STRING,
    noi_dung: DataTypes.TEXT,
    quoc_gia: DataTypes.STRING,
    thoi_gian: DataTypes.STRING,
    dien_vien: DataTypes.STRING,
    do_phan_giai: DataTypes.STRING,
    nam_san_xuat: DataTypes.STRING,
    tap_da_phat: DataTypes.STRING,
    tong_so_tap: DataTypes.STRING,
    ten_goc: DataTypes.STRING,
    duong_dan_gioi_thieu: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'phims',
    timestamps: true,  // Bật tự động cập nhật createdAt, updatedAt
    tableName: 'phims'
  });

  return phims;
};
