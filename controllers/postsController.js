const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { Comment } = require("../models/Comment");
const { Post, createPost, updatePost } = require("../models/Post");

/**----------------------------------------
 * @desc Create New Post
 * @Route /api/posts
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  //
  if (!req.file) {
    return res.status(400).json({ message: "no image provided" });
  }
  //
  const { error } = createPost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  //
  const imagePath = req.file.filename;

  // Create the post with the image data
  const post = await Post.create({
    postImage: imagePath,
    user: req.user.id,
    description: req.body.description,
    domaine: req.body.domaine,
  });
  res.status(201).json(post);
});

/**----------------------------------------
 * @desc Get All Posts
 * @Route /api/posts
 * @method GET
 * @access public
------------------------------------------*/
module.exports.GetAllPostsCtrl = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", ["-password"])
    .populate("comments");

  res.status(200).json(posts);
});
/**----------------------------------------
 * @desc Get Single Post
 * @Route /api/posts/:id
 * @method GET
 * @access public
------------------------------------------*/
module.exports.GetCoachPostsCtrl = asyncHandler(async (req, res) => {
  const coachId = req.params.id;
  const posts = await Post.find({ user: coachId })
    .populate("user", ["-password"])
    .populate("comments");
  if (!posts || posts.length === 0) {
    return res.status(404).json({ message: "Posts not found for this coach" });
  }

  res.status(200).json(posts);
});
/**----------------------------------------
 * @desc Delete Post
 * @Route /api/posts/:id
 * @method DELETE
 * @access private (only user himself)
------------------------------------------*/
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (req.user.id === post.user.toString()) {
    await Post.findByIdAndDelete(req.params.id);

    await Comment.deleteMany({ postId: post._id });

    res.status(200).json({
      message: "post has been deleted successfully",
      postId: post._id,
    });
  } else {
    res.status(403).json({ message: "access denied, forbidden" });
  }
});
/**----------------------------------------
 * @desc Update Post
 * @Route /api/posts/:id
 * @method PUT
 * @access private (Only owner of the post )
------------------------------------------*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  const { error } = updatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  if (req.user.id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allowed" });
  }
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        description: req.body.description,
        domaine: req.body.domaine,
      },
    },
    { new: true }
  )
    .populate("user", ["-password"])
    .populate("comments");

  res.status(200).json(updatedPost);
});
/**----------------------------------------
 * @desc Toggle Like
 * @Route /api/posts/like/:id
 * @method PUT
 * @access private (Only logged in user )
------------------------------------------*/
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }
  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === req.user.id
  );
  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: req.user.id },
      },
      { new: true }
    );
  }
  res.status(200).json(post);
});
