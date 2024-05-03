const router = require("express").Router();
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
  createNestedCommentsCtrl,
} = require("../controllers/commentsController");
const {
  verifyToken,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

router.route("/").post(verifyToken, createCommentCtrl);

router
  .route("/:id")
  .post(validateObjectId, verifyToken, createNestedCommentsCtrl)
  .get(validateObjectId, getAllCommentsCtrl)
  .delete(validateObjectId, verifyToken, deleteCommentCtrl)
  .put(validateObjectId, verifyToken, updateCommentCtrl);
module.exports = router;
