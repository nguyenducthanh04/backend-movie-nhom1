'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Phims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ten_phim: {
        type: Sequelize.STRING
      },
      ten_dia_chi_phim: {
        type: Sequelize.STRING
      },
      the_loai: {
        type: Sequelize.STRING,
      },
      danh_muc_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'DanhMucs', // Tên bảng
          key: 'id',
        },
        onDelete: 'CASCADE'
      },
      anh_nen_phim: {
        type: Sequelize.STRING
      },
      anh_poster_phim: {
        type: Sequelize.STRING
      },
      noi_dung: {
        type: Sequelize.TEXT
      },
      quoc_gia: {
        type: Sequelize.STRING
      },
      thoi_gian: {
        type: Sequelize.STRING
      },
      dien_vien: {
        type: Sequelize.STRING
      },
      do_phan_giai: {
        type: Sequelize.STRING
      },
      nam_san_xuat: {
        type: Sequelize.STRING
      },
      tap_da_phat: {
        type: Sequelize.STRING
      },
      tong_so_tap: {
        type: Sequelize.STRING
      },
      duong_dan_gioi_thieu: {
        type: Sequelize.STRING
      },
      ten_goc: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Phims');
  }
};