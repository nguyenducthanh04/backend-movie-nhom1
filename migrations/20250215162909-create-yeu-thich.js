'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('YeuThiches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nguoi_dung_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Tên bảng chứa khóa chính
          key: "id"
        },
        onDelete: "CASCADE" // Xóa bản ghi nếu user bị xóa
      },
      phim_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Phims", // Tên bảng chứa khóa chính
          key: "id"
        },
        onDelete: "CASCADE" // Xóa bản ghi nếu phim bị xóa
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
    await queryInterface.dropTable('YeuThiches');
  }
};