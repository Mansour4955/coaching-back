const router = require("express").Router();

const {
  createPostCtrl,
  GetAllPostsCtrl,
  GetSinglePostCtrl,
  deletePostCtrl,
  updatePostCtrl,
  toggleLikeCtrl,
} = require("../controllers/postsController");
const photoUpload = require("../middlewares/photoUpload");
const {
  verifyToken,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(GetAllPostsCtrl);

router
  .route("/:id")
  .get(validateObjectId, GetSinglePostCtrl)
  .delete(validateObjectId, verifyTokenAndOnlyUser, deletePostCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updatePostCtrl);

router.route("/like/:id").put(validateObjectId, verifyToken, toggleLikeCtrl);
module.exports = router;
