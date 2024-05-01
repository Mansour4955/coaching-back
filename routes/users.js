const { getAllUsersCtrl, getUserProfileCtrl, updateUserProfileCtrl, deleteUserProfileCtrl, profilePhotoUploadCtrl } = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyTokenAndOnlyUser, verifyToken } = require("../middlewares/verifyToken");

const router = require("express").Router();

router.route("/").get(getAllUsersCtrl);
router
  .route("/:id")
  .get(validateObjectId,getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser,updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenAndOnlyUser,deleteUserProfileCtrl)
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

// router
//   .route("/profile-photo-upload")

module.exports = router;
