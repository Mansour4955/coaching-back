const asyncHandler = require("express-async-handler");
const { Message, createMessage, updateMessage } = require("../models/Message");
/**----------------------------------------
 * @desc Create New Message
 * @Route /api/messages
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.createMessageCtrl = asyncHandler(async (req, res) => {
  const { error } = createMessage(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const message = await Message.create({
    chatId: req.params.id,
    sender: req.user.id,
    message: req.body.message,
  });
  res.status(201).json(message);
});
/**----------------------------------------
 * @desc Get All messages
 * @Route /api/messages
 * @method GET
 * @access public 
------------------------------------------*/
module.exports.getAllMessagesCtrl = asyncHandler(async (req, res) => {
  const chatId = req.params.id;
  const messages = await Message.find({ chatId });
  res.status(200).json(messages);
});
/**----------------------------------------
 * @desc Delete Message
 * @Route /api/messages/:id
 * @method DELETE
 * @access private (Only owner of the message)
------------------------------------------*/
module.exports.deleteMessageCtrl = asyncHandler(async (req, res) => {
  userId = req.user.id;
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ message: "message not found" });
  }

  if (userId === message.sender.toString()) {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "message has been deleted" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});
/**----------------------------------------
 * @desc Update Message
 * @Route /api/messages/:id
 * @method PUT
 * @access private (Only owner of the message)
------------------------------------------*/
module.exports.updateMessageCtrl = asyncHandler(async (req, res) => {
  userId = req.user.id;
  const { error } = updateMessage(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const message = await Message.findById(req.params.id);
  if (!message) {
    return res.status(404).json({ message: "message not found" });
  }

  if (userId !== message.sender.toString()) {
    return res.status(403).json({
      message: "access denied, only user himself can edit their message",
    });
  }
  const updateMessage = await Message.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        message: req.body.message,
      },
    },
    { new: true }
  );
  res.status(200).json(updateMessage);
});
