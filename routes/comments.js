const router = require("express").Router();
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/commentsController");
const {
  verifyToken,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

router.route("/").post(verifyToken, createCommentCtrl);

router
  .route("/:id")
  .get(validateObjectId,getAllCommentsCtrl)
  .delete(validateObjectId, verifyTokenAndOnlyUser, deleteCommentCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateCommentCtrl);
module.exports = router;
