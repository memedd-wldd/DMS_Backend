const express = require('express');
const authValidator = require('../middlewares/validators/validation');
const userValidation = require("../middlewares/validators/user-validator");
const userController =require('../controllers/users/create-user');
const rolesController =require('../controllers/users/user-roles');
const createValidation = require('../middlewares/validators/user/create-user-validation');
const updateValidation =require('../middlewares/validators/user/update-user-validation');
const mainValidation = require('../middlewares/validators/main-validation');
const disableValidation  =require('../middlewares/validators/user/disable-enable-user')

const router = express.Router();



router.post('/create_user',userValidation,authValidator,createValidation,mainValidation, userController.createUser);

router.post('/update_user',authValidator,updateValidation,mainValidation,userController.updateUser )

router.get('/getAll_roles',authValidator,rolesController.getAllRoles);

router.get('/getAll_users',authValidator,userController.getAllUsers);

router.post('/disable_user',authValidator,disableValidation,mainValidation,userController.disableUser)




module.exports = router