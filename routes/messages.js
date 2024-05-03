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

router.route("/").post(verifyToken, createMessageCtrl);

router
  .route("/:id")
  .get(verifyToken, getAllMessagesCtrl)
  .delete(validateObjectId, verifyToken, deleteMessageCtrl)
  .put(validateObjectId, verifyToken, updateMessageCtrl);
module.exports = router;
