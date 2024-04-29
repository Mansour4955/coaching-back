const { loginUserCtrl, registerUserCtrl } = require("../controllers/authController");

const router = require("express").Router();

router.post("/register",registerUserCtrl);

router.post("/login",loginUserCtrl);

module.exports = router;
