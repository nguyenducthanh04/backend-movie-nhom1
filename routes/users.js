var express = require('express');
var router = express.Router();
const UserController = require("../controllers/user.controller");
/* GET users listing. */
router.get('/all-user', UserController.getAllUsers);
router.get('/get-user-by/:id', UserController.getUserById);
router.post('/create-user', UserController.createUser);
router.put('/update-user/:id', UserController.updateUser);
router.delete('/delete-user/:id', UserController.deleteUser);


module.exports = router;
