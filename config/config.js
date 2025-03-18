require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DRIVER,
    dialectOptions: {
      ssl: {
        require: true, // Bắt buộc với Supabase
        rejectUnauthorized: false // Bỏ qua lỗi chứng chỉ (dùng tạm thời)
      },
      family: 4 // Ép dùng IPv4 để tránh vấn đề IPv6
    },
    logging: true, // Bật log để debug
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DRIVER,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      family: 4
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DRIVER,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      family: 4
    },
  },
};