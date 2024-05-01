const asyncHandler = require("express-async-handler");
const { Comment, createComment, updateComment } = require("../models/Comment");
const { User } = require("../models/User");
/**----------------------------------------
 * @desc Create New Comment
 * @Route /api/comments
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = createComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // const profile = await User.findById(req.user.id);
  const comment = await Comment.create({
    user: req.user.id,
    postId: req.body.postId,
    comment: req.body.comment,
    // userInfo: profile,
  });
  res.status(201).json(comment);
});
/**----------------------------------------
 * @desc Get All Comments of the post
 * @Route /api/comments/:id
 * @method GET
 * @access public 
------------------------------------------*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id }).populate(
    "user"
  );
  res.status(200).json(comments);
});
/**----------------------------------------
 * @desc Delete Comment
 * @Route /api/comments/:id
 * @method DELETE
 * @access private (Only owner of the comment)
------------------------------------------*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }
  if (req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "comment has been deleted" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});
/**----------------------------------------
 * @desc Update Comment
 * @Route /api/comments/:id
 * @method PUT
 * @access private (Only owner of the comment)
------------------------------------------*/
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = updateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }
  if (req.user.id !== comment.user.toString()) {
    return res.status(403).json({
      message: "access denied, only user himself can edit their comment",
    });
  }
  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        comment: req.body.comment,
        level1: req.body.level1,
        level2: req.body.level2,
        level3: req.body.level3,
      },
    },
    { new: true }
  );
  res.status(200).json(updatedComment);
});
