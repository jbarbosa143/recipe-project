const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  updateUser,
  fetchUserInfo,
} = require("./controller/userController");

const checkIsUndefined = require("./helpers/checkIsUndefined");
const checkIsEmptyFunc = require("./helpers/checkIsEmptyFunc");
const checkIsStrongPasswordFunc = require("./helpers/checkIsStrongPasswordFunc");

const {
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
} = require("./helpers/authMiddleware");

const jwtMiddleware = require("../utils/jwtMiddleware");

router.post(
  "/sign-up",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsStrongPasswordFunc,
  checkIsEmailFunc,
  checkIsAlphaFunc,
  checkIsAlphanumericFunc,
  signup
);

router.post(
  "/login",
  checkIsUndefined,
  checkIsEmptyFunc,
  checkIsEmailFunc,
  login
);

router.put("/update-user-profile", jwtMiddleware, updateUser);

router.get("/get-user-info", jwtMiddleware, fetchUserInfo);

module.exports = router;
