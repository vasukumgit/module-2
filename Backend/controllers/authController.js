const db = require("../config/db");
const jwt = require("jsonwebtoken");
 
const pendingNewUsers = new Map();
let lastPendingIdentifier = null;
 
// const isValidEmail = (email) => {
//   const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
//   return emailRegex.test(email);
// };
const isValidEmail = (email) => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;

  return emailRegex.test(email);
};
 
const isValidName = (name) => {
  const nameRegex = /^[A-Za-z ]{2,25}$/;
  return nameRegex.test(name.trim());
};
const normalizeEmail = (email) => {
  return email ? String(email).trim().toLowerCase() : null;
};
 
const normalizePhone = (phone) => {
  return phone ? String(phone).replace(/\D/g, "") : null;
};
 
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};
const getIdentifier = (email, phone) => {
  if (email) return normalizeEmail(email);
  if (phone) return normalizePhone(phone);
  return null;
};
 
const getPendingIdentifier = (email, phone) => {
  let identifier = getIdentifier(email, phone);
 
  if (!identifier && lastPendingIdentifier) {
    identifier = lastPendingIdentifier;
  }
 
  if (!identifier && pendingNewUsers.size === 1) {
    identifier = Array.from(pendingNewUsers.keys())[0];
  }
 
  return identifier;
};
 
exports.checkUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
 
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
    if (phone && !isValidPhone(phone)) {
  return res.status(400).json({
    msg: "Phone number must contain exactly 10 digits",
  });
}
 
    const identifier = getIdentifier(email, phone);
 
    if (!identifier) {
      return res.status(400).json({ msg: "Email or phone required" });
    }
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE LOWER(email) = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    return res.json({ isNewUser: !users[0] });
  } catch (err) {
    console.error("checkUser error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
 
exports.createUser = async (req, res) => {
  try {
    // const name = req.body.name;
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
    const role = req.body.role || "Designer";
 
      // Name validation
    if (!isValidName(name)) {
      return res.status(400).json({
        msg: "Name should contain only letters, no numbers or special characters, and must be below 25 characters",
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
    if (phone && !isValidPhone(phone)) {
  return res.status(400).json({
    msg: "Phone number must contain exactly 10 digits",
  });
}
 
    if (!name || (!email && !phone)) {
      return res.status(400).json({ msg: "Name and email/phone required" });
    }
 
    const identifier = getIdentifier(email, phone);
 
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE LOWER(email) = ? OR phone = ?",
      [email || null, phone || null]
    );
 
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }
 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 15 * 60 * 1000);
 
    pendingNewUsers.set(identifier, {
      name,
      email,
      phone,
      role,
      otp,
      otp_expiry,
    });
 
    lastPendingIdentifier = identifier;
 
    console.log(`🔐 OTP for new user (${identifier}): ${otp}`);
 
    return res.status(201).json({
      msg: "OTP sent successfully",
      isNewUser: true,
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
 
exports.sendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
 
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
 
    if (phone && !isValidPhone(phone)) {
  return res.status(400).json({
    msg: "Phone number must contain exactly 10 digits",
  });
}
    const identifier = getIdentifier(email, phone);
 
    if (!identifier) {
      return res.status(400).json({ msg: "Email or phone required" });
    }
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE LOWER(email) = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    const user = users[0];
 
    if (!user) {
      return res.json({ isNewUser: true });
    }
 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 15 * 60 * 1000);
 
    await db.execute(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?",
      [otp, otp_expiry, user.id]
    );
 
    console.log(`🔐 OTP for existing user (${identifier}): ${otp}`);
 
    return res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
 
exports.resendOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
 
    if (email && !isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
 
    let identifier = getPendingIdentifier(email, phone);
 
    if (!identifier) {
      return res.status(400).json({ msg: "Email or phone required" });
    }
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE LOWER(email) = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    const existingUser = users[0];
 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 15 * 60 * 1000);
 
    if (existingUser) {
      await db.execute(
        "UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?",
        [otp, otp_expiry, existingUser.id]
      );
 
      console.log(`🔄 Resent OTP for existing user (${identifier}): ${otp}`);
 
      return res.json({ msg: "OTP resent successfully" });
    }
 
    let pendingUser = pendingNewUsers.get(identifier);
 
    if (!pendingUser && lastPendingIdentifier) {
      identifier = lastPendingIdentifier;
      pendingUser = pendingNewUsers.get(identifier);
    }
 
    if (!pendingUser) {
      return res.status(400).json({
        msg: "Signup session expired. Please start signup again.",
      });
    }
 
    pendingNewUsers.set(identifier, {
      ...pendingUser,
      otp,
      otp_expiry,
    });
 
    lastPendingIdentifier = identifier;
 
    console.log(`🔄 Resent OTP for new user (${identifier}): ${otp}`);
 
    return res.json({ msg: "OTP resent successfully" });
  } catch (err) {
    console.error("resendOtp error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
 
exports.verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);
    const otp = req.body.otp;
 
    if (!otp) {
      return res.status(400).json({ msg: "OTP required" });
    }
 
    let identifier = getPendingIdentifier(email, phone);
 
    if (!identifier) {
      return res.status(400).json({ msg: "Email/Phone required" });
    }
 
    const [users] = await db.execute(
      email
        ? "SELECT * FROM users WHERE LOWER(email) = ?"
        : "SELECT * FROM users WHERE phone = ?",
      [identifier]
    );
 
    const user = users[0];
 
    if (user) {
      if (!user.otp || user.otp !== otp.toString()) {
        return res.status(400).json({ msg: "Invalid OTP" });
      }
 
      if (new Date(user.otp_expiry) < new Date()) {
        return res.status(400).json({ msg: "OTP expired" });
      }
 
      const loginType = email ? "email" : "phone";
 
      await db.execute(
        `
        UPDATE users
        SET
          otp = NULL,
          otp_expiry = NULL,
          primary_login = IF(primary_login IS NULL, ?, primary_login)
        WHERE id = ?
        `,
        [loginType, user.id]
      );
 
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1d" }
      );
 
      return res.json({
        _id: user.id,
        email: user.email,
        phone: user.phone,
        primary_login: user.primary_login || loginType,
        token,
        msg: "OTP verified successfully",
      });
    }
 
    let pendingUser = pendingNewUsers.get(identifier);
 
    if (!pendingUser && lastPendingIdentifier) {
      identifier = lastPendingIdentifier;
      pendingUser = pendingNewUsers.get(identifier);
    }
 
    if (!pendingUser) {
      return res.status(400).json({
        msg: "Signup session expired. Please start signup again.",
      });
    }
 
    if (pendingUser.otp !== otp.toString()) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
 
    if (new Date(pendingUser.otp_expiry) < new Date()) {
      pendingNewUsers.delete(identifier);
      return res.status(400).json({
        msg: "OTP expired. Please start signup again.",
      });
    }
 
    // const primaryLogin = pendingUser.email ? "email" : "phone";
 const primaryLogin = email ? "email" : "phone";
    const [result] = await db.execute(
      `
      INSERT INTO users
      (name, email, phone, role, primary_login)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        pendingUser.name,
        pendingUser.email,
        pendingUser.phone,
        pendingUser.role || "Designer",
        primaryLogin,
      ]
    );
 
    pendingNewUsers.delete(identifier);
    lastPendingIdentifier = null;
 
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );
 
    return res.json({
      _id: result.insertId,
      email: pendingUser.email,
      phone: pendingUser.phone,
      primary_login: primaryLogin,
      token,
      msg: "OTP verified successfully",
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
}; 