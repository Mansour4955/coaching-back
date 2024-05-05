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

router.route("/").post(verifyToken, createCommentCtrl).get(getAllCommentsCtrl);

router
  .route("/:id")
  .post(validateObjectId, verifyToken, createNestedCommentsCtrl)
  .delete(validateObjectId, verifyToken, deleteCommentCtrl)
  .put(validateObjectId, verifyToken, updateCommentCtrl);
module.exports = router;
