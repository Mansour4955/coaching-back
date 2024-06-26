const router = require("express").Router();

const {
  createPostCtrl,
  GetAllPostsCtrl,
  deletePostCtrl,
  updatePostCtrl,
  toggleLikeCtrl,
  GetCoachPostsCtrl,
} = require("../controllers/postsController");
const photoUpload = require("../middlewares/photoUpload");
const {
  verifyToken,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(GetAllPostsCtrl);

router
  .route("/:id")
  .get(validateObjectId, GetCoachPostsCtrl)
  .delete(validateObjectId, verifyToken, deletePostCtrl)
  .put(validateObjectId, verifyToken, updatePostCtrl);

router.route("/like/:id").put(validateObjectId, verifyToken, toggleLikeCtrl);
module.exports = router;
