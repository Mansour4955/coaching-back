const asyncHandler = require("express-async-handler");
const { Comment, createComment, updateComment } = require("../models/Comment");
const { Post } = require("../models/Post");
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
  const comment = await Comment.create({
    user: req.user.id,
    postId: req.body.postId,
    comment: req.body.comment,
  });
  res.status(201).json(comment);
});
/**----------------------------------------
 * @desc Create nested Comments
 * @Route /api/comments/id
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.createNestedCommentsCtrl = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const { level, levelId } = req.query;

  // Fetch the comment
  let levelComment = await Comment.findById(commentId);
  if (!levelComment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  // Add the new nested comment based on the provided level
  switch (level) {
    case "level1":
      levelComment.level1.push({
        user: req.user.id,
        comment: req.body.comment,
        commentDate: new Date(),
      });
      break;
    case "level2":
      // Ensure levelId is provided
      if (!levelId) {
        return res.status(400).json({ message: "Missing 'levelId' parameter" });
      }
      // Find the level1 comment based on levelId
      const level1Comment = levelComment.level1.find(
        (item) => item._id == levelId
      );
      if (!level1Comment) {
        return res.status(404).json({ message: "Level1 comment not found" });
      }
      // Add the nested comment to level2
      level1Comment.level2.push({
        user: req.user.id,
        comment: req.body.comment,
        commentDate: new Date(),
      });
      break;
    case "level3":
      // Ensure levelId is provided
      if (!levelId) {
        return res.status(400).json({ message: "Missing 'levelId' parameter" });
      }
      // Find the level2 comment based on levelId
      const level2Comment = levelComment.level1
        .reduce((acc, cur) => acc.concat(cur.level2), [])
        .find((item) => item._id == levelId);
      if (!level2Comment) {
        return res.status(404).json({ message: "Level2 comment not found" });
      }
      // Add the nested comment to level3
      level2Comment.level3.push({
        user: req.user.id,
        comment: req.body.comment,
        commentDate: new Date(),
      });
      break;
    default:
      return res.status(400).json({ message: "Invalid level provided" });
  }

  // Save the updated comment
  const updatedComment = await levelComment.save();
  res.status(201).json(updatedComment);
});
/**----------------------------------------
 * @desc Get All Comments of the post
 * @Route /api/comments/:id
 * @method GET
 * @access public 
------------------------------------------*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const { postId } = req.query;
  const comments = await Comment.find({ postId }).populate("user");
  res.status(200).json(comments);
});
/**----------------------------------------
 * @desc Delete Comment
 * @Route /api/comments/:id
 * @method DELETE
 * @access private (Only owner of the comment)
------------------------------------------*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const { id: commentId } = req.params;
  const { level, levelId } = req.query;

  try {
    // Fetch the comment
    let comment;
    switch (level) {
      case "main":
        comment = await Comment.findById(commentId);
        break;
      case "level1":
        comment = await Comment.findOne({ "level1._id": levelId });
        break;
      case "level2":
        comment = await Comment.findOne({ "level1.level2._id": levelId });
        break;
      case "level3":
        comment = await Comment.findOne({
          "level1.level2.level3._id": levelId,
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid level provided" });
    }

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has permission to delete the comment
    if (level === "main") {
      // If deleting the main comment, only allow the user who created it to delete
      if (req.user.id !== comment.user.toString()) {
        return res.status(403).json({ message: "Access denied, not allowed" });
      }
    } else {
      // If deleting a nested comment, only allow the user who created that nested comment to delete it
      let nestedComment;
      switch (level) {
        case "level1":
          nestedComment = comment.level1.find(
            (item) => item._id.toString() === levelId
          );
          break;
        case "level2":
          nestedComment = comment.level1
            .flatMap((level1Comment) => level1Comment.level2)
            .find((item) => item._id.toString() === levelId);
          break;
        case "level3":
          nestedComment = comment.level1
            .flatMap((level1Comment) =>
              level1Comment.level2.flatMap(
                (level2Comment) => level2Comment.level3
              )
            )
            .find((item) => item._id.toString() === levelId);
          break;
      }
      if (!nestedComment) {
        return res.status(404).json({ message: "Nested comment not found" });
      }
      if (req.user.id !== nestedComment.user.toString()) {
        return res.status(403).json({ message: "Access denied, not allowed" });
      }
    }

    // Remove the comment based on the provided level
    switch (level) {
      case "main":
        await Comment.findByIdAndDelete(commentId);
        break;
      case "level1":
        comment.level1 = comment.level1.filter(
          (item) => item._id.toString() !== levelId
        );
        break;
      case "level2":
        comment.level1.forEach((level1Comment) => {
          level1Comment.level2 = level1Comment.level2.filter(
            (item) => item._id.toString() !== levelId
          );
        });
        break;
      case "level3":
        comment.level1.forEach((level1Comment) => {
          level1Comment.level2.forEach((level2Comment) => {
            level2Comment.level3 = level2Comment.level3.filter(
              (item) => item._id.toString() !== levelId
            );
          });
        });
        break;
    }

    // Save the updated comment if it's not a main comment
    if (level !== "main") {
      await comment.save();
    }

    res.status(200).json({ message: "Comment has been deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
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

  const { id: commentId } = req.params;
  const { level, levelId } = req.query;

  try {
    // Fetch the comment
    const comment = await Comment.findOne({
      $or: [
        { _id: commentId },
        { "level1._id": levelId },
        { "level1.level2._id": levelId },
        { "level1.level2.level3._id": levelId },
      ],
    });

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has permission to update the comment
    switch (level) {
      case "main":
        if (req.user.id !== comment.user.toString()) {
          return res.status(403).json({
            message:
              "Access denied, only the user who created the main comment can edit it",
          });
        }
        break;
      case "level1":
        const level1Comment = comment.level1.find(
          (item) => item._id.toString() === levelId
        );
        if (!level1Comment) {
          return res.status(404).json({ message: "Level 1 comment not found" });
        }
        if (req.user.id !== level1Comment.user.toString()) {
          return res.status(403).json({
            message:
              "Access denied, only the user who created the nested comment can edit it",
          });
        }
        // Update level1Comment content
        level1Comment.comment = req.body.comment;
        break;
      case "level2":
        comment.level1.forEach((level1Comment) => {
          const level2Comment = level1Comment.level2.find(
            (item) => item._id.toString() === levelId
          );
          if (level2Comment && req.user.id !== level2Comment.user.toString()) {
            return res.status(403).json({
              message:
                "Access denied, only the user who created the nested comment can edit it",
            });
          }
          if (level2Comment) {
            level2Comment.comment = req.body.comment;
          }
        });
        break;
      case "level3":
        comment.level1.forEach((level1Comment) => {
          level1Comment.level2.forEach((level2Comment) => {
            const level3Comment = level2Comment.level3.find(
              (item) => item._id.toString() === levelId
            );
            if (
              level3Comment &&
              req.user.id !== level3Comment.user.toString()
            ) {
              return res.status(403).json({
                message:
                  "Access denied, only the user who created the nested comment can edit it",
              });
            }
            if (level3Comment) {
              level3Comment.comment = req.body.comment;
            }
          });
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid level provided" });
    }

    // Save the updated comment
    const updatedComment = await comment.save();
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
