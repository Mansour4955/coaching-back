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

router.route("/").post(verifyToken, createCommentCtrl).get(getAllCommentsCtrl);

router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndOnlyUser, deleteCommentCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateCommentCtrl);
module.exports = router;
