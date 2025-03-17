'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'verificationCode', {
      type: Sequelize.STRING,
      allowNull: true, // Đặt giá trị null nếu cần
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'verificationCode', {
      type: Sequelize.STRING, // Quay lại kiểu ban đầu
      allowNull: true,
    });
  }
};
