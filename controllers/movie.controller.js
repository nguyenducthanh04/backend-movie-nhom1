const { where } = require('sequelize');
const { Op } = require("sequelize");
const { sequelize } = require("../models/index");
const Model = require('../models/index');
const Phim = Model.Phims;
const TapPhim = Model.TapPhims;
class MovieController {
    async getAnimeMovie(req, res){
        try {
            let { page } = req.query;
            page = parseInt(page) || 1;
            const limit = 1; 
            const offset = (page - 1) * limit;

            const { count, rows: animeMovie } = await Phim.findAndCountAll({
                where: { danh_muc_id: '1' },
                limit,
                offset
            });

            res.json({
                message: 'Danh sách phim anime',
                data: {
                    items: animeMovie,
                    params: {
                        pagination: {
                            totalPages: Math.ceil(count / limit),
                            currentPage: page
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    async getMovieDetail(req, res){
        try {
            const { ten_dia_chi_phim } = req.params;
            const animeDetail = await Phim.findOne({
                where: { ten_dia_chi_phim },
                include: [
                    { model: TapPhim },
                ]
            });
            console.log("hiiii", animeDetail)
            if (!animeDetail) {
                return res.status(404).json({ message: 'Không tìm thấy phim' });
            }

            res.json({ movie: animeDetail });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    async addToFavorites(req, res) {
        try {
            const { nguoi_dung_id, phim_id } = req.body;
            const [results] = await sequelize.query(
                'SELECT * FROM "YeuThiches" WHERE nguoi_dung_id = :nguoi_dung_id AND phim_id = :phim_id',
                {
                    replacements: { nguoi_dung_id, phim_id },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (results) {
                return res.status(400).json({ message: "Phim đã có trong danh sách yêu thích" });
            }

            await sequelize.query(
                'INSERT INTO "YeuThiches" ("nguoi_dung_id", "phim_id", "createdAt", "updatedAt") VALUES (:nguoi_dung_id, :phim_id, NOW(), NOW())',
                {
                    replacements: { nguoi_dung_id, phim_id },
                    type: sequelize.QueryTypes.INSERT
                }
            );

            res.json({ message: "Đã thêm phim vào danh sách yêu thích" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async removeFromFavorites(req, res) {
        try {
            const { nguoi_dung_id, phim_id } = req.body;
            const [results] = await sequelize.query(
                'SELECT * FROM "YeuThiches" WHERE nguoi_dung_id = :nguoi_dung_id AND phim_id = :phim_id',
                {
                    replacements: { nguoi_dung_id, phim_id },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
            if (!results) {
                return res.status(400).json({ message: "Phim không có trong danh sách yêu thích" });
            }
            await sequelize.query(
                'DELETE FROM "YeuThiches" WHERE nguoi_dung_id = :nguoi_dung_id AND phim_id = :phim_id',
                {
                    replacements: { nguoi_dung_id, phim_id },
                    type: sequelize.QueryTypes.RAW
                }
            );
    
            res.json({ message: "Đã xóa phim khỏi danh sách yêu thích" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async checkIfSaved(req, res) {
        try {
            const { phim_id } = req.params;
            const { nguoi_dung_id } = req.query; 
    
            if (!nguoi_dung_id) {
                return res.status(400).json({ message: "Thiếu thông tin người dùng" });
            }
    
            const movie = await Phim.findOne({
                where: { id: phim_id },
                attributes: ["id"]
            });
    
            if (!movie) {
                return res.status(404).json({ message: "Không tìm thấy phim" });
            }
    
           
            const [results] = await sequelize.query(
                `SELECT * FROM "YeuThiches" WHERE nguoi_dung_id = :nguoi_dung_id AND phim_id = :phim_id`,
                {
                    replacements: { nguoi_dung_id, phim_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
    
            res.json({ isSaved: results ? true : false }); 
        } catch (error) {
            console.error("Lỗi khi kiểm tra danh sách yêu thích:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getFavoriteMovies(req, res) {
        try {
            const { nguoi_dung_id } = req.query; 
    
            if (!nguoi_dung_id) {
                return res.status(400).json({ message: "Thiếu thông tin người dùng" });
            }
            const favoriteMovies = await sequelize.query(
                `SELECT p.id, p.ten_phim, p.anh_nen_phim, p.ten_dia_chi_phim
                FROM "YeuThiches" y
                JOIN "Phims" p ON y.phim_id = p.id
                WHERE y.nguoi_dung_id = :nguoi_dung_id`,
                {
                    replacements: { nguoi_dung_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );
    
            res.json({ message: "Danh sách phim yêu thích", data: favoriteMovies });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phim yêu thích:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getSingleMovie(req, res){
        try {
            let { page } = req.query;
            page = parseInt(page) || 1;
            const limit = 1; 
            const offset = (page - 1) * limit;

            const { count, rows: singleMovie } = await Phim.findAndCountAll({
                where: { danh_muc_id: '2' },
                limit,
                offset
            });

            res.json({
                message: 'Danh sách phim lẻ',
                data: {
                    items: singleMovie,
                    params: {
                        pagination: {
                            totalPages: Math.ceil(count / limit),
                            currentPage: page
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    async getSeriesMovie(req, res){
        try {
            let { page } = req.query;
            page = parseInt(page) || 1;
            const limit = 1; 
            const offset = (page - 1) * limit;

            const { count, rows: seriesMovie } = await Phim.findAndCountAll({
                where: { danh_muc_id: '3' },
                limit,
                offset
            });

            res.json({
                message: 'Danh sách phim bộ',
                data: {
                    items: seriesMovie,
                    params: {
                        pagination: {
                            totalPages: Math.ceil(count / limit),
                            currentPage: page
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    async getTVShows(req, res){
        try {
            let { page } = req.query;
            page = parseInt(page) || 1;
            const limit = 1; 
            const offset = (page - 1) * limit;

            const { count, rows: tvShows } = await Phim.findAndCountAll({
                where: { danh_muc_id: '4' },
                limit,
                offset
            });

            res.json({
                message: 'Danh sách phim truyền hình',
                data: {
                    items: tvShows,
                    params: {
                        pagination: {
                            totalPages: Math.ceil(count / limit),
                            currentPage: page
                        }
                    }
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    async searchMovie(req, res) {
        try {
            let { keyword } = req.query;
            if (!keyword) {
                return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
            }

            const movies = await Phim.findAll({
                where: {
                    [Op.or]: [
                        { ten_phim: { [Op.like]: `%${keyword}%` } }, 
                        { ten_goc: { [Op.like]: `%${keyword}%` } } 
                    ]
                }
                
            });

            res.json({
                message: "Kết quả tìm kiếm",
                data: { items: movies }
            });
        } catch (error) {
            console.error("Lỗi khi tìm kiếm phim:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getLatestMovies(req, res) {
        try {
            const latestMovies = await Phim.findAll({
                order: [['createdAt', 'DESC']], 
                limit: 2, 
            });
    
            res.json({
                message: "Danh sách 2 phim mới nhất",
                data: latestMovies
            });
        } catch (error) {
            console.error("Lỗi khi lấy phim mới nhất:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getMovieByCategory(req, res) {
        try {
            const { danh_muc_id } = req.query; 
    
            if (!danh_muc_id) {
                return res.status(400).json({ message: "Thiếu danh mục phim" });
            }
    
            const movie = await Phim.findAll({
                where: { danh_muc_id },
                order: [['createdAt', 'DESC']], 
            });
    
            if (!movie) {
                return res.status(404).json({ message: "Không tìm thấy phim trong danh mục này" });
            }
    
            res.json({
                message: "Phim thuộc danh mục",
                data: movie
            });
        } catch (error) {
            console.error("Lỗi khi lấy phim theo danh mục:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getAllMovies(req, res) {
        try {
            // Lấy tất cả phim từ database
            const allMovies = await Phim.findAll({
                order: [['createdAt', 'DESC']] // Sắp xếp theo ngày tạo giảm dần (mới nhất trước)
            });
    
            // Kiểm tra nếu không có phim nào
            if (!allMovies || allMovies.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phim nào trong database" });
            }
    
            // Trả về response thành công với danh sách phim
            res.json({
                message: "Danh sách tất cả phim",
                data: {
                    items: allMovies,
                    total: allMovies.length
                }
            });
        } catch (error) {
            console.error("Lỗi khi lấy tất cả phim:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }  
 // API thêm phim
async addMovie(req, res) {
    try {
        const {
            ten_phim,
            ten_dia_chi_phim,
            the_loai,
            danh_muc_id,
            anh_nen_phim,
            anh_poster_phim,
            noi_dung,
            quoc_gia,
            thoi_gian,
            dien_vien,
            do_phan_giai,
            nam_san_xuat,
            tap_da_phat,
            tong_so_tap,
            duong_dan_gioi_thieu,
            tapphims // Mảng chứa thông tin các tập phim
        } = req.body;

        // Kiểm tra các trường bắt buộc của phim
        if (!ten_phim || !ten_dia_chi_phim || !danh_muc_id) {
            return res.status(400).json({ 
                message: "Thiếu thông tin bắt buộc: ten_phim, ten_dia_chi_phim, danh_muc_id" 
            });
        }

        // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
        const result = await sequelize.transaction(async (t) => {
            // Tạo phim mới
            const newMovie = await Phim.create({
                ten_phim,
                ten_dia_chi_phim,
                the_loai,
                danh_muc_id,
                anh_nen_phim,
                anh_poster_phim,
                noi_dung,
                quoc_gia,
                thoi_gian,
                dien_vien,
                do_phan_giai,
                nam_san_xuat,
                tap_da_phat,
                tong_so_tap,
                duong_dan_gioi_thieu,
                createdAt: new Date(),
                updatedAt: new Date()
            }, { transaction: t });

            // Nếu có tapphims, tạo các tập phim
            let createdTapPhims = [];
            if (tapphims && Array.isArray(tapphims) && tapphims.length > 0) {
                const tapPhimData = tapphims.map(tap => ({
                    ten_tap_phim: tap.ten_tap_phim,
                    ten_dia_chi_tap: tap.ten_dia_chi_tap,
                    ten_tep_phim: tap.ten_tep_phim,
                    duong_dan_nhung_phim: tap.duong_dan_nhung_phim,
                    duong_dan_truc_tuyen: tap.duong_dan_truc_tuyen,
                    phim_id: newMovie.id, // Liên kết với phim vừa tạo
                    createdAt: new Date(),
                    updatedAt: new Date()
                }));

                // Kiểm tra các trường bắt buộc của tập phim
                for (const tap of tapPhimData) {
                    if (!tap.ten_tap_phim || !tap.ten_dia_chi_tap || !tap.duong_dan_truc_tuyen) {
                        throw new Error("Mỗi tập phim phải có ten_tap_phim, ten_dia_chi_tap và duong_dan_truc_tuyen");
                    }
                }

                createdTapPhims = await TapPhim.bulkCreate(tapPhimData, { transaction: t });
            }

            // Gắn tập phim vào phim để trả về response
            newMovie.dataValues.tapphims = createdTapPhims;

            return newMovie;
        });

        res.status(201).json({
            message: "Thêm phim và tập phim thành công",
            data: {
                items: [result],
                total: 1
            }
        });
    } catch (error) {
        console.error("Lỗi khi thêm phim và tập phim:", error);
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
}

    // API sửa phim
async updateMovie(req, res) {
    try {
        const { id } = req.params;
        const {
            ten_phim,
            ten_dia_chi_phim,
            the_loai,
            danh_muc_id,
            anh_nen_phim,
            anh_poster_phim,
            noi_dung,
            quoc_gia,
            thoi_gian,
            dien_vien,
            do_phan_giai,
            nam_san_xuat,
            tap_da_phat,
            tong_so_tap,
            duong_dan_gioi_thieu,
            tapphims 
        } = req.body;

        // Tìm phim theo ID
        const movie = await Phim.findByPk(id);
        if (!movie) {
            return res.status(404).json({ message: "Không tìm thấy phim" });
        }

        // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
        const result = await sequelize.transaction(async (t) => {
            // Cập nhật thông tin phim
            await movie.update({
                ten_phim: ten_phim || movie.ten_phim,
                ten_dia_chi_phim: ten_dia_chi_phim || movie.ten_dia_chi_phim,
                the_loai: the_loai || movie.the_loai,
                danh_muc_id: danh_muc_id || movie.danh_muc_id,
                anh_nen_phim: anh_nen_phim || movie.anh_nen_phim,
                anh_poster_phim: anh_poster_phim || movie.anh_poster_phim,
                noi_dung: noi_dung || movie.noi_dung,
                quoc_gia: quoc_gia || movie.quoc_gia,
                thoi_gian: thoi_gian || movie.thoi_gian,
                dien_vien: dien_vien || movie.dien_vien,
                do_phan_giai: do_phan_giai || movie.do_phan_giai,
                nam_san_xuat: nam_san_xuat || movie.nam_san_xuat,
                tap_da_phat: tap_da_phat || movie.tap_da_phat,
                tong_so_tap: tong_so_tap || movie.tong_so_tap,
                duong_dan_gioi_thieu: duong_dan_gioi_thieu || movie.duong_dan_gioi_thieu,
                updatedAt: new Date()
            }, { transaction: t });

            // Xử lý tập phim (nếu có tapphims trong request)
            if (tapphims && Array.isArray(tapphims)) {
                // Xóa tất cả tập phim cũ của phim này
                await TapPhim.destroy({
                    where: { phim_id: id },
                    transaction: t
                });

                // Thêm các tập phim mới
                if (tapphims.length > 0) {
                    const tapPhimData = tapphims.map(tap => ({
                        ten_tap_phim: tap.ten_tap_phim,
                        ten_dia_chi_tap: tap.ten_dia_chi_tap,
                        ten_tep_phim: tap.ten_tep_phim,
                        duong_dan_nhung_phim: tap.duong_dan_nhung_phim,
                        duong_dan_truc_tuyen: tap.duong_dan_truc_tuyen,
                        phim_id: id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }));

                    // Kiểm tra các trường bắt buộc của tập phim
                    for (const tap of tapPhimData) {
                        if (!tap.ten_tap_phim || !tap.ten_dia_chi_tap || !tap.duong_dan_truc_tuyen) {
                            throw new Error("Mỗi tập phim phải có ten_tap_phim, ten_dia_chi_tap và duong_dan_truc_tuyen");
                        }
                    }

                    // Tạo mới các tập phim
                    const createdTapPhims = await TapPhim.bulkCreate(tapPhimData, { transaction: t });
                    movie.dataValues.tapphims = createdTapPhims; // Gắn tập phim vào response
                } else {
                    movie.dataValues.tapphims = []; // Không có tập phim mới
                }
            }

            return movie;
        });

        res.json({
            message: "Cập nhật phim thành công",
            data: {
                items: [result],
                total: 1
            }
        });
    } catch (error) {
        console.error("Lỗi khi sửa phim:", error);
        res.status(500).json({ message: error.message || "Lỗi server" });
    }
}

    // API xóa phim
    async deleteMovie(req, res) {
        try {
            const { id } = req.params;

            // Tìm phim theo ID
            const movie = await Phim.findByPk(id);
            if (!movie) {
                return res.status(404).json({ message: "Không tìm thấy phim" });
            }

            // Xóa phim
            await movie.destroy();

            res.json({
                message: "Xóa phim thành công",
                data: {
                    items: [], // Không cần trả về dữ liệu phim đã xóa
                    total: 0
                }
            });
        } catch (error) {
            console.error("Lỗi khi xóa phim:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    // Các API khác giữ nguyên (getAllMovies, getAnimeMovie, v.v.)
    async getAllMovies(req, res) {
        try {
            const allMovies = await Phim.findAll({
                order: [['createdAt', 'DESC']]
            });
    
            if (!allMovies || allMovies.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phim nào trong database" });
            }
    
            res.json({
                message: "Danh sách tất cả phim",
                data: {
                    items: allMovies,
                    total: allMovies.length
                }
            });
        } catch (error) {
            console.error("Lỗi khi lấy tất cả phim:", error);
            res.status(500).json({ message: "Lỗi server" });
        }
    }
    async getMovieById(req, res) {
        try {
          const { id } = req.params;
          const movie = await Phim.findByPk(id, {
            include: [
                { model: TapPhim }
            ]
        });
        
          if (!movie) {
            return res.status(404).json({ message: "Không tìm thấy phim" });
          }
          res.json({
            message: "Chi tiết phim",
            data: { items: [movie], total: 1 }
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Lỗi server" });
        }
      }
}

module.exports = new MovieController();
