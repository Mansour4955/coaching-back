const asyncHandler = require("express-async-handler");
const { User, updateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");
const { Message } = require("../models/Message");
const { Chat } = require("../models/Chat");

/**----------------------------------------
 * @desc Get All Users Profile
 * @Route /api/users
 * @method GET
 * @access public
------------------------------------------*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {
  let query = {};
  const { city, method, course, maxPrice, name } = req.query;
  if (city) {
    query.city = city;
  }
  if (method) {
    query.method = method;
  }
  if (course) {
    query.course = course;
  }
  if (maxPrice) {
    query.price = { $lte: maxPrice };
  }
  if (name) {
    query.username = { $regex: new RegExp(name, "i") };
  }
  const users = await User.find(query)
    .select("-password")
    .populate("posts")
    .populate("follow")
    .populate("following");
  res.status(200).json(users);
});
/**----------------------------------------
 * @desc Get User Profile
 * @Route /api/users/:id
 * @method GET
 * @access public
------------------------------------------*/
module.exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.status(200).json(user);
});
/**----------------------------------------
 * @desc Update User Profile
 * @Route /api/users/:id
 * @method PUT
 * @access private (only user himself)
------------------------------------------*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = updateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        profession: req.body.profession,
        course: req.body.course,
        city: req.body.city,
        method: req.body.method,
        price: req.body.price,
        education: req.body.education,
        about: req.body.about,
        trainings: req.body.trainings,
        softSkills: req.body.softSkills,
        experiences: req.body.experiences,
        follow: req.body.follow,
        following: req.body.following,
        appointmentOrders: req.body.appointmentOrders,
        appointmentOnWait: req.body.appointmentOnWait,
        appointmentAcceptedFromCoach: req.body.appointmentAcceptedFromCoach,
        appointmentAccepted: req.body.appointmentAccepted,
        coachNotifications: req.body.coachNotifications,
        clientNotifications: req.body.clientNotifications,
        reviews: req.body.reviews,
        chats: req.body.chats,
        posts: req.body.posts,
      },
    },
    { new: true }
  ).select("-password");
  res.status(200).json(updatedUser);
});
/**----------------------------------------
 * @desc Profile Photo Upload
 * @Route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  // 2
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  //3 upload to cloudinary
  const result = await cloudinaryUploadImage(imagePath);
  console.log(result);
  //4 get the user from db
  const user = await User.findById(req.user.id);
  //5 delete the old profile photo if exists
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }
  //6 change the profilePhoto field in the db
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();
  // 7 send response to client
  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
  //8 remove image from the server
  fs.unlinkSync(imagePath);
});
/**----------------------------------------
 * @desc Delete User Profile (Account)
 * @Route /api/users/:id
 * @method DELETE
 * @access private (Only user himself)
------------------------------------------*/
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });
  await Chat.deleteMany({ user: user._id });
  await Message.deleteMany({ user: user._id });
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "your profile has been deleted" });
});
