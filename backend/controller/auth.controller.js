import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { generateTokenSetCookie } from "../Utils/generateTokenSetCookie.js";
import {
  sendverificationEmail,
  welcomeEmail,
  sendPasswordResetMail,
  successResetPasswordEmail,
} from "../mails/emails.js";
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All Field Required");
    }
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(409)
        .json({ success: false, message: "User Already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      password: hashPassword,
      name,
      lastlogin: new Date(),
      verificationToken,
      verificationTokenExpireAT: Date.now() + 24 * 60 * 60 * 1000,
    });
    await generateTokenSetCookie(res, user._id);
    await user.save();
    await sendverificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      mssage: "User Created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpireAT: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired Verification Code",
      });
    } else {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpireAT = null;
    }
    await user.save();

    await welcomeEmail(user.name, user.email);
    return res.status(201).json({
      success: true,
      message: "Welcome Email Sended",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (!isPasswordvalid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    } else {
      const token = generateTokenSetCookie(res, user._id);
      user.lastlogin = new Date();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Login Completed",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error.message,
    });
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged Out Succesfully",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Wrong Emails",
      });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenValidTill = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = resetTokenValidTill;
    await user.save();
    await sendPasswordResetMail(
      user.email,
      `${process.env.CLIENT_URL}/resetpassword/${resetToken}`
    );

    return res.status(200).json({
      success: true,
      message: "Reset Password Mail Sended Successfully",
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    // console.log("Token from params:", token);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Provided Wrong Reset Token",
      });
    } else {
      user.resetPasswordExpireAt = null;
      user.resetPasswordToken = null;
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
      await user.save();
      await successResetPasswordEmail(user.email);
      return res.status(200).json({
        success: true,
        message: "Password reset Successfully",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `Reset Pass word page fails -> ${error.message}`,
    });
  }
};

const checkAuth = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not  found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Authentication Success",
        user,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};
