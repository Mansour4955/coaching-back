const router = require("express").Router();

const {
  verifyToken,
  verifyTokenAndOnlyUser,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  createChatCtrl,
  getAllChatsCtrl,
  deleteChatCtrl,
  updateChatCtrl,
} = require("../controllers/chatsController");

router
  .route("/")
  .post(verifyToken, createChatCtrl)
  .get(verifyToken, getAllChatsCtrl);

router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndOnlyUser, deleteChatCtrl)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateChatCtrl);
module.exports = router;
