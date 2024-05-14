const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  deleteUserProfileCtrl,
  profilePhotoUploadCtrl,
} = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyTokenAndOnlyUser,
  verifyToken,
} = require("../middlewares/verifyToken");

const router = require("express").Router();

router.route("/").get(getAllUsersCtrl);
router
  .route("/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, updateUserProfileCtrl)
  .delete(validateObjectId, verifyToken, deleteUserProfileCtrl);

router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

module.exports = router;
