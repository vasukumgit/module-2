const db = require("../../config/db");
// ===============================
// VALIDATIONS
// ===============================

const isValidName = (name) => {
  // only alphabets + spaces, min 2 chars, max 25 chars
  const nameRegex = /^[A-Za-z ]{2,25}$/;
  return nameRegex.test(name);
};

const isValidPhone = (phone) => {
  // exactly 10 digits
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const isValidEmail = (email) => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;

  return emailRegex.test(email);
};

 
// ===============================
// GET PROFILE SETTINGS
// ===============================
exports.getProfileSettings = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        id,
        name,
        email,
        phone,
        role,
        profile_image,
        time_zone,
        primary_login
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );
 
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
 
    const user = rows[0];
 
    if (!user.time_zone) {
      user.time_zone = "India (GMT+5:30)";
    }
 
    res.json(user);
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

 //verify old otp
exports.verifyOldPhoneOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;
 
  const [rows] = await db.execute(
    "SELECT phone, otp, otp_expiry FROM users WHERE id = ?",
    [userId]
  );
 
  const user = rows[0];
if (!user || user.otp !== otp.toString())  {
    return res.status(400).json({ message: "Invalid OTP" });
  }
 
  if (new Date(user.otp_expiry) < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }
 
  // mark verified
  await db.execute(
    "UPDATE users SET is_old_phone_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE id = ?",
    [userId]
  );
 
  res.json({ message: "Old phone verified successfully" });
};
exports.verifyOldEmailOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;
 
  const [rows] = await db.execute(
    "SELECT email, otp, otp_expiry FROM users WHERE id = ?",
    [userId]
  );
 
  const user = rows[0];
 
  if (!user || user.otp !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
 
  if (new Date(user.otp_expiry) < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }
 
  await db.execute(
    "UPDATE users SET is_old_email_verified = TRUE, otp = NULL, otp_expiry = NULL WHERE id = ?",
    [userId]
  );
 
  res.json({ message: "Old email verified successfully" });
};
 
// ===============================
// UPDATE PROFILE SETTINGS
// ===============================
exports.updateProfileSettings = async (req, res) => {
  try {
    
    const { name, role, time_zone, profile_image } = req.body;
    // NAME VALIDATION
    if (name && !isValidName(name)) {
      return res.status(400).json({
        message:
          "Name should contain only letters and spaces, max 25 characters",
      });
    }
 
    const [rows] = await db.execute(
      `SELECT name, role, time_zone FROM users WHERE id = ?`,
      [req.user.id]
    );
 
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
 
    const current = rows[0];
 
    const updatedName = name ?? current.name;
    const updatedRole = role ?? current.role;
    const updatedTimeZone =
      time_zone ?? current.time_zone ?? "India (GMT+5:30)";
 
    await db.execute(
      `UPDATE users
       SET name = ?, role = ?, time_zone = ?, profile_image = ?
       WHERE id = ?`,
      [
        updatedName,
        updatedRole,
        updatedTimeZone,
        profile_image || null,
        req.user.id
      ]
    );
    
 
    res.json({ message: "Profile updated successfully" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// REQUEST OTP (EMAIL/PHONE UPDATE)
// ===============================
exports.requestProfileUpdate = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const userId = req.user.id;
 
    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone required" });
    }
      // EMAIL VALIDATION
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // PHONE VALIDATION
    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits",
      });
    }

 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
 
    //  ONLY users table
    await db.execute(
      `UPDATE users
       SET otp = ?, otp_expiry = ?, temp_email = ?, temp_phone = ?
       WHERE id = ?`,
      [otp, expiry, email || null, phone || null, userId]
    );
 
    console.log("OTP:", otp);
 
    res.json({ message: "OTP sent successfully" });
 
  } catch (err) {
    console.error("REQUEST UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// VERIFY OTP
// ===============================
exports.verifyProfileUpdate = async (req, res) => {
  try {
    const { otp } = req.body;
 
    const [rows] = await db.execute(
      `SELECT otp, otp_expiry, temp_email, temp_phone
       FROM users
       WHERE id = ?`,
      [req.user.id]
    );
 
    const user = rows[0];
 
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
 
    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
 
    await db.execute(
      `UPDATE users
       SET email = COALESCE(temp_email, email),
           phone = COALESCE(temp_phone, phone),
           temp_email = NULL,
           temp_phone = NULL,
           otp = NULL,
           otp_expiry = NULL
       WHERE id = ?`,
      [req.user.id]
    );
 
    res.json({ message: "Profile updated successfully" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
 
// ===============================
// DELETE ACCOUNT
// ===============================
exports.deleteAccount = async (req, res) => {
  try {
    await db.execute(
      "DELETE FROM users WHERE id = ?",
      [req.user.id]
    );
 
    res.json({ message: "Account deleted successfully" });
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};