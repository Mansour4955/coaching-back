const asyncHandler = require("express-async-handler");
const { createChat, updateChat, Chat } = require("../models/Chat");
/**----------------------------------------
 * @desc Create New Chat
 * @Route /api/chats
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.createChatCtrl = asyncHandler(async (req, res) => {
  const { error } = createChat(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let chat;
  chat = await Chat.findOne({ users: req.body.users });
  if (chat) {
    return res.status(400).json({ message: "chat already exists" });
  }
  chat = await Chat.create({
    users: req.body.users,
  });
  res.status(201).json(chat);
});
/**----------------------------------------
 * @desc Get All Chats
 * @Route /api/chats
 * @method GET
 * @access public 
------------------------------------------*/
module.exports.getAllChatsCtrl = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const chats = await Chat.find({ users: userId })
    .populate("messages")
    .populate("users");
  res.status(200).json(chats);
});
/**----------------------------------------
 * @desc Get single chat
 * @Route /api/chats/:id
 * @method GET
 * @access public 
------------------------------------------*/
module.exports.getSingleChatCtrl = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const chat = await Chat.findById(chatId)
    .populate("messages")
    .populate("users");
  res.status(200).json(chat);
});
/**----------------------------------------
 * @desc Delete Chat
 * @Route /api/chats/:id
 * @method DELETE
 * @access private (Only owner of the chat)
------------------------------------------*/
module.exports.deleteChatCtrl = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).json({ message: "chat not found" });
  }

  const isUserMember = chat.users.includes(req.user.id);
  if (isUserMember) {
    await Chat.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "chat has been deleted" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});
/**----------------------------------------
 * @desc Update Comment
 * @Route /api/comments/:id
 * @method PUT
 * @access private (Only owner of the chat)
------------------------------------------*/
// won't use I think
module.exports.updateChatCtrl = asyncHandler(async (req, res) => {
  const { error } = updateChat(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const chat = await Chat.findById(req.params.id);
  if (!chat) {
    return res.status(404).json({ message: "chat not found" });
  }
  const isUserMember = chat.users.includes(req.user.id);

  if (!isUserMember) {
    return res.status(403).json({
      message: "access denied, only user himself can edit their chat",
    });
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        messages: req.body.messages,
      },
    },
    { new: true }
  );
  res.status(200).json(updatedChat);
});
