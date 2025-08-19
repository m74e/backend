import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.models.js"; // assuming you have a User model

// SIGN UP
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

// SIGN IN
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: { id: user._id, email: user.email, username: user.username },
      });
  } catch (error) {
    next(error);
  }
};

// SIGN OUT
export const signOut = async (req, res, next) => {
  try {
    // For JWT, "sign out" usually means letting the client delete the token.
    // If using refresh tokens or sessions, you’d revoke them here.
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    next(error);
  }
};
