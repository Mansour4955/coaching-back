const router = require("express").Router();

const {
  verifyToken,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  createChatCtrl,
  getAllChatsCtrl,
  deleteChatCtrl,
  updateChatCtrl,
  getSingleChatCtrl,
} = require("../controllers/chatsController");

router
  .route("/")
  .post(verifyToken, createChatCtrl)
  .get(verifyToken, getAllChatsCtrl);

router
  .route("/:id")
  .get(validateObjectId, verifyToken, getSingleChatCtrl)
  .delete(validateObjectId, verifyToken, deleteChatCtrl)
  .put(validateObjectId, verifyToken, updateChatCtrl);
module.exports = router;
