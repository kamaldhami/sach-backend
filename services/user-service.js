const { tryCatchHandler } = require("../helpers/error-handler");
const {
  DbAddUser,
  DbCountUser,
  DbFindUser,
  DbUpdateUser
} = require("../model/User");

const { generateToken } = require("../config/jwt.config");


const { forgetMail, activateUser } = require('../helpers/nodemailer')

const bcrypt = require("bcrypt");
const { SALT_ROUND } = require("../constants/common");
const { default: mongoose } = require("mongoose");
const { USERNAME_ALREADY, EMAIL_ALREADY } = require('../constants/messages');

const registerUserService = tryCatchHandler(async (body) => {



  let user = await DbFindUser({
    query: {
      username: body.username,
    },
    project: {
      _id: 1,
      name: 1,
      mobile: 1,
      email: 1
    },
    multiple: false,
  });

  if (user) throw new Error(USERNAME_ALREADY);

  const userExist = await DbCountUser({
    query: {
      email: body.email
    },
  });

  if (userExist) {
    throw new Error(EMAIL_ALREADY);
  }

  if (!user) {
    body.password = await bcrypt.hash(body.password, SALT_ROUND);

    user = await DbAddUser(body);
    const { message } = activateUser(user)
  
  }



  return {
    record: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    }
  }
});


const loginService = tryCatchHandler(async (body) => {
  let query = { email: body.email };


  let user = {};
  user = await DbFindUser({
    multiple: false,
    query: query,
    project: {
      _id: 1,
      name: 1,
      username: 1,
      email: 1,
      verified: 1,
      password: 1,
    },
  });

  if (!user) {
    throw new Error(USER_NOT_EXIST);
  } else if (!user.verified) {
    throw new Error("User not verified! check you email.");
  }
  else {

    const passwordMatch = await bcrypt.compare(body.password, user.password);
    if (passwordMatch) {
      const token = await generateToken(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );

      return {
        token: token,
        record: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        },
      };
    } else {
      throw new Error(INCORRECT_PASSWORD);
    }
  }
});

const getUserList = tryCatchHandler(async (body) => {
  const totalRecords = await DbCountUser({
    query: body.query,
  });

  let user = [];
  if (totalRecords) {
    user = await DbFindUser({
      multiple: true,
      query: body.query,
      project: {
        _id: 1,
        name: 1,
        username: 1,
        mobile: 1,
        email: 1,
        role: 1,
        status: 1,
      },
      skip: body.skip,
      limit: body.limit,
      sort: body.sort,
    });
  }
  return {
    users: user,
    totalRecords: totalRecords,
  };
});

const updateUserService = tryCatchHandler(async (body) => {
  let user = await DbUpdateUser({
    query: {
      _id: mongoose.Types.ObjectId(body._id),
    },
    update: body,
    option: {},
    multiple: false,
  });

  return user;
});



const forgetPasswordService = tryCatchHandler(async (email) => {

  let user = await DbFindUser({
    multiple: false,
    query: {
      email: email,
    },
    project: {
      _id: 1,
      email: 1,
      google_signIn: 1
    },
  });

  if (!user)
    throw new Error(USER_NOT_EXIST);
  else if (user.google_signIn)
    throw new Error(GOOGLE_EMAIL);
  else {
    let { message, error, data } = forgetMail(user)
    if (error)
      throw new Error(message)
    return {
      data,
      message
    };


  }
})


module.exports = {
  registerUserService,
  loginService,
  getUserList,
  updateUserService,
  forgetPasswordService
};
