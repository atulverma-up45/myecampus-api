import { pool } from "../config/database/connectToDB.js";

// email validation function
function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

export const loginController = async (req, res) => {
  try {
    const { reg_No, password, mobile_No, email } = req.body;

    // Input validation
    if (!reg_No) {
      return res
        .status(400)
        .json({ status: 400, message: "Registration Number is Required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ status: 400, message: "Password is Required" });
    }

    if (!mobile_No) {
      return res.status(400).json({
        status: 400,
        message: "Mobile Number is Required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        status: 400,
        message: "Email is Required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: "Please enter a valid email",
      });
    }

    // MySQL query for user validation
    // const query = `SELECT * FROM users WHERE Reg_no = ? AND DOB = ? AND Mobile_No = ? AND Email = ? LIMIT 1`;
    const query = `SELECT * FROM tbl_login_Master WHERE Reg_no = ? AND DOB = ?`;
    // const values = [reg_No.trim(), password.trim(), mobile_No.trim(), email.trim()];
    const values = [reg_No.trim(), password.trim()];

    const [user] = await pool.query(query, values);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Successful login, returning user data
    return res.status(200).json({
      status: 200,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Error occurred while logging in the user: ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
