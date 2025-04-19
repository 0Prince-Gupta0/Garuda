import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { name, email, password, role, photo, gender } = req.body;

  try {
    let user = null;

    if (role === "doctor") {
      user = await Doctor.findOne({ email });
    } else if (role === "patient") {
      user = await User.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    await user.save();
    res.status(201).json({ success: true, message: "User successfully created" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error, Please try again",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      user = await Doctor.findOne({ email }).select("+password");
    }

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isPswrdMatch = await bcrypt.compare(password, user.password);
    if (!isPswrdMatch) {
      return res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user);
    const { password: _, role, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to login" });
  }
};
