const {
  loginUserCtrl,
  registerUserCtrl,
} = require("../controllers/authController");
const photoUpload = require("../middlewares/photoUpload");

const router = require("express").Router();

router.post("/register", photoUpload.single("image"), registerUserCtrl);

router.post("/login", loginUserCtrl);

module.exports = router;
