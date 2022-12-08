var express = require('express')
const userRouter = express.Router();

const {
    asyncHandler
} = require('../../helpers/error-handler');

const {
    checkToken
} = require('../../config/jwt.config');



const {
    register,
    getUser,
    login,
    updateUser,
    forgetPasswordLink,
    changePassword,
    checkResetLink,
    activateAccount
} = require('../../controllers/user-ctrl');



userRouter.post('/register', asyncHandler(register));
userRouter.post('/login', asyncHandler(login)); 
userRouter.get('/activate/:id',asyncHandler(activateAccount))
userRouter.post('/forgetPasswordLink',asyncHandler(forgetPasswordLink));
userRouter.post('/changePassword',asyncHandler(checkToken),asyncHandler(changePassword))
userRouter.get('/check-resetpassword-link',asyncHandler(checkToken),asyncHandler(checkResetLink))


module.exports = userRouter;