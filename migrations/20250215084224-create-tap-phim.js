'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TapPhims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ten_tap_phim: {
        type: Sequelize.STRING
      },
      ten_dia_chi_tap: {
        type: Sequelize.STRING
      },
      ten_tep_phim: {
        type: Sequelize.STRING
      },
      duong_dan_nhung_phim: {
        type: Sequelize.STRING
      },
      duong_dan_truc_tuyen: {
        type: Sequelize.STRING
      },
      phim_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Phims', // Tên bảng tham chiếu
          key: 'id',
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('TapPhims');
  }
};