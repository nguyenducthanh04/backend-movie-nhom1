const { User } = require('../models'); 
const bcrypt = require('bcryptjs');
const { sequelize } = require("../models/index");
const { Sequelize } = require('sequelize'); 
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.status(200).json({
                message: "Lấy danh sách user thành công",
                data: users
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }

            const favoriteMovies = await sequelize.query(
                `SELECT p.* 
                 FROM Phims p
                 INNER JOIN YeuThiches yt ON p.id = yt.phim_id
                 WHERE yt.nguoi_dung_id = :nguoiDungId`,
                {
                    replacements: { nguoiDungId: id },
                    type: Sequelize.QueryTypes.SELECT
                }
            );

            const userData = {
                ...user.toJSON(),
                favoriteMovies
            };

            res.status(200).json({
                message: "Lấy thông tin user thành công",
                data: userData
            });
        } catch (error) {
            console.error("Lỗi khi lấy user:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    async createUser(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: "Email đã được sử dụng" });
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await User.create({
                name: username,
                email,
                password: hashedPassword,
                isVerified: 1, 
                createdAt: new Date(),
                updatedAt: new Date()
            });

            res.status(201).json({
                message: "Thêm user thành công",
                data: newUser
            });
        } catch (error) {
            console.error("Lỗi khi thêm user:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async updateUser(req, res) {
        try {
          const { id } = req.params;
          const { name, email, role, phimIdsToRemove } = req.body; 
    
          const user = await User.findByPk(id);
          if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
          }
    
          await user.update({
            name: name || user.name,
            email: email || user.email,
            role: role !== undefined ? role : user.role,
            updatedAt: new Date(),
          });
    
          // Xóa phim yêu thích nếu có phimIdsToRemove
          if (phimIdsToRemove && Array.isArray(phimIdsToRemove) && phimIdsToRemove.length > 0) {
            await sequelize.query(
              `DELETE FROM YeuThiches 
               WHERE nguoi_dung_id = :nguoiDungId 
               AND phim_id IN (:phimIds)`,
              {
                replacements: { nguoiDungId: id, phimIds: phimIdsToRemove },
                type: Sequelize.QueryTypes.DELETE,
              }
            );
          }
    
          // Lấy lại danh sách phim yêu thích còn lại (tùy chọn)
          const updatedFavoriteMovies = await sequelize.query(
            `SELECT p.* 
             FROM Phims p
             INNER JOIN YeuThiches yt ON p.id = yt.phim_id
             WHERE yt.nguoi_dung_id = :nguoiDungId`,
            {
              replacements: { nguoiDungId: id },
              type: Sequelize.QueryTypes.SELECT,
            }
          );
    
          res.status(200).json({
            message: "Cập nhật user và danh sách yêu thích thành công",
            data: {
              ...user.toJSON(),
              favoriteMovies: updatedFavoriteMovies,
            },
          });
        } catch (error) {
          console.error("Lỗi khi sửa user:", error);
          res.status(500).json({ message: "Lỗi server", error: error.message });
        }
      }

    // API: Xóa user (DELETE /users/:id)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Tìm user theo ID
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Không tìm thấy user" });
            }

            // Xóa user
            await user.destroy();

            res.status(200).json({ message: "Xóa user thành công" });
        } catch (error) {
            console.error("Lỗi khi xóa user:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    // Giữ lại hàm gốc của bạn
    async User(req, res) {
        res.send("Hello anh em!");
    }
}

module.exports = new UserController();