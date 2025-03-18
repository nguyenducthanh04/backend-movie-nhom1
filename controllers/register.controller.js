const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Users } = require('../models');
const nodemailer = require("nodemailer");

class RegisterController {
  async Register(req, res) {
    const { email, password, name } = req.body;

    try {
      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email đã được sử dụng' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const verificationCode = crypto.randomBytes(4).toString('hex');
      const newUser = await Users.create({
        email,
        password: hashedPassword,
        name,
        verificationCode: verificationCode,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "dducthanh04@gmail.com",
          pass: "midn lcia tcly pcbn",
        },
      });

      await transporter.sendMail({
        from: 'Thanh Nguyen <dducthanh04@gmail.com>',
        to: email,
        subject: 'Mã xác thực đăng ký',
        html: `<p>Xin chào ${name},</p>
               <p>Mã xác thực đăng ký của bạn là: <strong>${verificationCode}</strong></p>
               <p>Vui lòng nhập mã này để hoàn tất quá trình đăng ký.</p>`
      });

      res.status(201).json({
        message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  async Verify(req, res) {
    const { emailAccount, verificationCode } = req.body;

    try {
      const user = await Users.findOne({ where: { email: emailAccount } });
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Tài khoản đã được xác thực' });
      }

      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ message: 'Mã xác thực không chính xác' });
      }

      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: 'Xác thực thành công. Tài khoản của bạn đã được kích hoạt.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  // Hàm generate mã mới và gửi email
  async generateNewCode(req, res) {
    const { emailResetVerify } = req.body;

    try {
      const user = await Users.findOne({ where: { email: emailResetVerify } });
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      const newCode = crypto.randomBytes(4).toString('hex');
      user.verificationCode = newCode;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "dducthanh04@gmail.com",
          pass: "midn lcia tcly pcbn",
        },
      });

      await transporter.sendMail({
        from: 'Thanh Nguyen <dducthanh04@gmail.com>',
        to: emailResetVerify,
        subject: 'Mã xác thực mới',
        html: `<p>Xin chào,</p>
               <p>Mã xác thực mới của bạn là: <strong>${newCode}</strong></p>
               <p>Vui lòng nhập mã này để xác thực tài khoản của bạn.</p>`
      });

      res.status(200).json({ message: 'Mã xác thực mới đã được gửi đến email của bạn.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  }
}

module.exports = new RegisterController();
