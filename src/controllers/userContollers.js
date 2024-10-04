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
    const searchUserQuery = `SELECT * FROM tbl_login_Master WHERE Reg_no = ? AND DOB = ?`;
    const searchValues = [reg_No.trim(), password.trim()];  // using password as DOB

    const [user] = await pool.query(searchUserQuery, searchValues);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `User with Registration Number ${reg_No} not found.`,
      });
    }

    const updateUserQuery = `
    UPDATE tbl_login_Master 
    SET Mobile_No = ?, Email = ? 
    WHERE Reg_no = ? AND DOB = ?;
    `;
    
    const updateValues = [
      mobile_No,
      email.trim(),
      reg_No.trim(),
      password.trim(),
    ];

    const [updatedUser] = await pool.query(updateUserQuery, updateValues);

    // Check if update was successful
    if (updatedUser.affectedRows === 0) {
      return res.status(400).json({
        status: 400,
        message: "Failed to update user details.",
      });
    }

    const [userDetails] = await pool.query(searchUserQuery, searchValues);

    // Successful login, returning user data
    return res.status(200).json({
      status: 200,
      message: "Login and update successful.",
      userDetails
    });
  } catch (error) {
    console.error("Error occurred while logging in the user: ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


export const getUser = async (req, res) => {
  try {
    const query = `SELECT * FROM tbl_login_Master ORDER BY sno ASC LIMIT 25`;

    const [users] = await pool.query(query);

    if (users.length === 0) {
      return res.status(404).json({ status: 404, message: "No users found" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Users fetched successfully", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};
