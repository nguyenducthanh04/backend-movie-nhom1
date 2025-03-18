'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("phims", "ten_goc", {
      type: Sequelize.STRING, // Cập nhật kiểu dữ liệu
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("phims", "ten_goc", {
      type: Sequelize.FLOAT, // Khôi phục lại kiểu cũ nếu cần rollback
      allowNull: true,
    });
  }
};
