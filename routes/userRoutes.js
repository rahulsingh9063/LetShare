const express = require('express');
const { registerController, loginController, updateUserController, requireSignIn } = require('../controllers/userController');

//router object
const router = express.Router();

//routes
//register with post
router.post('/register',registerController);

//login post
router.post('/login', loginController);

//update post
router.put('/update-user', requireSignIn , updateUserController )

//update post
router.put('/update-user', requireSignIn , updateUserController )

//export
module.exports = router;