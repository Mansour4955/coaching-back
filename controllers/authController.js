const {registerUser,loginUser,updateUser,User} = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.registerUserCtrl = async (req, res) => {
    const { error } = registerUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "user already exists" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
    }
  };
  /**
   * @desc Login user
   * @route /api/auth/login
   * @method POST
   * @access public
   */
  module.exports.loginUserCtrl = async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ message: "invalid email" });
      }
      const encodedPassword = await bcrypt.compare(req.body.password, user.password);
      if (!encodedPassword) {
        return res.status(400).json({ message: "invalid password" });
      }
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );
      const { password, ...other } = user._doc;
      res.status(200).json({ ...other, token });
    } catch (error) {
      res.status(500).json({ message: "something went wrong!" });
    }
  };
  