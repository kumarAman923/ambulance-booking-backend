const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    // ✅ Validation
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (phone.length !== 10 || isNaN(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this phone number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      phone,
      password: hashedPassword,
      role: "user" // ✅ default role "user" (driver alag se add honge)
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // ✅ Validation
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" }); // 401 for auth failure
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Check JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // ✅ role bhi token mein daalo
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role // ✅ frontend ke liye role bhejna zaroori
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again" });
  }
};