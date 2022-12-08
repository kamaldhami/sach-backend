const {
    registerUserService,
    loginService,
    updateUserService,
    forgetPasswordService
} = require('../services/user-service');

const bcrypt = require("bcrypt");
const { SALT_ROUND } = require("../constants/common");

const {
    SUCCESS
} = require('../constants/messages');
const {
    default: mongoose
} = require('mongoose');


const register = async (req, res) => {
    const response = await registerUserService(
        req.body
    );
    res.status(201).json({
        message: "success",
        data: response
    });

};

const login = async (req, res) => {
    req.body.web = true;
    const response = await loginService(req.body);
    res.status(200).json({
        message: "Login Successfull",
        data: response
    });
};

const updateUser = async (req, res) => {
    let user = await updateUserService(req.body);

    res.status(200).json({
        message: "User Updated!",
        data: user
    });
}

const forgetPasswordLink = async (req, res) => {

    const response = await forgetPasswordService(req.body.email);

    res.status(200).json({
        message: response['message'],
        data: response['data']
    });

}

const changePassword = async (req, res) => {

    let { password } = req.body
    password = await bcrypt.hash(password, SALT_ROUND);

    let user = await updateUserService({
        _id: req.user._id,
        password: password
    });

    res.status(200).json({
        message: "User Updated!",
        data: user
    });
}

const checkResetLink = (req, res) => {

    try {
        res.status(200).json({ message: 'success' })
    } catch (err) {
        res.status(400).json({ message: err })
    }
}

const activateAccount = async (req, res) => {

    let { id } = req.params

    let user = await updateUserService({
        _id: id,
        verified: true
    });

    res.status(200).json({
        message: "User Updated!",
        data: user
    });

}



module.exports = {
    register,
    login,
    updateUser,
    forgetPasswordLink,
    changePassword,
    checkResetLink,
    activateAccount
};