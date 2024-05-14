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
  const { city, method, course, maxPrice, name, role } = req.query;
  if (city) {
    query.city = city;
  }
  if (method) {
    query.method = method;
  }
  if (course) {
    query.course = course;
  }
  if (role) {
    query.role = role;
  }
  if (maxPrice) {
    query.price = { $lte: maxPrice };
  }
  if (name) {
    query.username = { $regex: new RegExp(name, "i") };
  }
  // query.role = "coach";
  const users = await User.find(query)
    .select("-password")
    .populate("posts")
    .populate("chats")
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
    .populate("posts")
    .populate("chats");
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
  const { user, date, message, field } = req.query;
  const { error } = updateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  let updatedUser;
  if (req.body.reviews) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { reviews: req.body.reviews },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.appointmentOrders) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { appointmentOrders: req.body.appointmentOrders },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.appointmentOnWait) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { appointmentOnWait: req.body.appointmentOnWait },
      },
      { new: true }
    ).select("-password");
  } else if (user && date && field === "appointmentOrders") {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { appointmentOrders: { user, date } },
      },
      { new: true }
    ).select("-password");
  } else if (user && date && field === "appointmentOnWait") {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { appointmentOnWait: { user, date } },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.appointmentAccepted) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { appointmentAccepted: req.body.appointmentAccepted },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.appointmentAcceptedFromCoach) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          appointmentAcceptedFromCoach: req.body.appointmentAcceptedFromCoach,
        },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.coachNotifications) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { coachNotifications: req.body.coachNotifications },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.clientNotifications) {
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { clientNotifications: req.body.clientNotifications },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.follow) {
    const follower = await User.findOne({
      _id: req.params.id,
      follow: { $in: req.body.follow },
    });
    if (follower) {
      return res
        .status(400)
        .json({ message: "they are already following you!" });
    }
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { follow: req.body.follow },
      },
      { new: true }
    ).select("-password");
  } else if (req.body.following) {
    const theFollowing = await User.findOne({
      _id: req.params.id,
      following: { $in: req.body.following },
    });
    if (theFollowing) {
      return res
        .status(400)
        .json({ message: "you are already followed them!" });
    }
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: { following: req.body.following },
      },
      { new: true }
    ).select("-password");
  } else if(user && date && field === "appointmentAccepted"){
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { appointmentAccepted: { user, date } },
      },
      { new: true }
    ).select("-password");
  }else if(user && date && field === "appointmentAcceptedFromCoach"){
    updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { appointmentAcceptedFromCoach: { user, date } },
      },
      { new: true }
    ).select("-password");
  } else {
    updatedUser = await User.findByIdAndUpdate(
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

          /////////////////////
          chats: req.body.chats,
          posts: req.body.posts,
        },
      },
      { new: true }
    ).select("-password");
  }
  // await updateUser.save();
  res.status(200).json(updatedUser);
});
/**----------------------------------------
 * @desc Profile Photo Upload
 * @Route /api/users/profile-photo-upload
 * @method POST
 * @access private (Only logged in user)
------------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  // 2
  const imagePath = req.file.filename;

  //3 get the user from db
  const user = await User.findById(req.user.id);
  //4 change the profilePhoto field in the db
  user.profileImage = imagePath;
  await user.save();
  // 5 send response to client
  res.status(200).json(user);
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
