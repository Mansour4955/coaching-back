const router = require("express").Router();

const {
  verifyToken,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  createMessageCtrl,
  getAllMessagesCtrl,
  deleteMessageCtrl,
  updateMessageCtrl,
} = require("../controllers/messagesController");

router
  .route("/")
  .post(verifyToken, createMessageCtrl)
  .get(verifyToken, getAllMessagesCtrl);

router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndOnlyUser, deleteMessageCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateMessageCtrl);
module.exports = router;
