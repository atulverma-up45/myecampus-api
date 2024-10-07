import { pool } from "../config/database/connectToDB.js";

// email validation function
function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Login user controller
export const loginController = async (req, res) => {
  try {
    const { reg_no, password } = req.body;

    // Input validation
    if (!reg_no) {
      return res
        .status(400)
        .json({ status: 400, message: "Registration Number is Required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ status: 400, message: "Password is Required" });
    }


    // MySQL query for user validation
    const searchUserQuery = `SELECT * FROM tbl_login_Master WHERE Reg_no = ? AND DOB = ?`;
    const searchValues = [reg_no.trim(), password.trim()]; // using password as DOB

    const [user] = await pool.query(searchUserQuery, searchValues);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `User with Registration Number ${reg_no} and DOB ${password} not found.`,
      });
    }

    // Successful login, returning user data
    return res.status(200).json({
      status: 200,
      message: "login successful.",
    });
  } catch (error) {
    console.error("Error occurred while logging in the user: ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// update user Details
export const updateUserDetailsController = async (req, res) => {
  try {
    const { reg_no, password, mobile_No, email } = req.body;

    // Input validation
    if (!reg_no) {
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
    const searchValues = [reg_no.trim(), password.trim()]; // using password as DOB

    const [user] = await pool.query(searchUserQuery, searchValues);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `User with Registration Number ${reg_no} not found.`,
      });
    }

    // Check for unique mobile number
    const checkMobileQuery = `SELECT * FROM tbl_login_Master WHERE Mobile_No = ? AND Reg_no <> ?`;
    const [existingMobile] = await pool.query(checkMobileQuery, [mobile_No, reg_no.trim()]);

    if (existingMobile.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Mobile Number already exists.",
      });
    }

    // Check for unique email
    const checkEmailQuery = `SELECT * FROM tbl_login_Master WHERE Email = ? AND Reg_no <> ?`;
    const [existingEmail] = await pool.query(checkEmailQuery, [email.trim(), reg_no.trim()]);

    if (existingEmail.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Email already exists.",
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
      reg_no.trim(),
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

    // Successful update, returning user data
    return res.status(200).json({
      status: 200,
      message: "User details updated successfully.",
      userDetails,
    });
  } catch (error) {
    console.error(
      "Error occurred while updating the user details in updateUserDetailsController: ",
      error
    );
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};


// Create Mpin controller
export const createMpinController = async (req, res) => {
  try {
    // fetch the data from the body
    const { reg_no, password, mpin } = req.body;

    // validate the input
    if (!reg_no) {
      return res
        .status(400)
        .json({ status: 400, message: "Registration Number is Required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ status: 400, message: "Password is Required" });
    }

    if (!mpin) {
      return res.status(400).json({ status: 400, message: "MPIN is required" });
    }

    // MySQL query for user validation
    const searchUserQuery = `SELECT * FROM tbl_login_Master WHERE Reg_no = ? AND DOB = ?`;
    const searchValues = [reg_no.trim(), password.trim()]; // using password as DOB for now

    const [user] = await pool.query(searchUserQuery, searchValues);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found. Please enter a valid Reg. No. and DOB.",
      });
    }

    // Check if the MPIN is already created
    if (user[0].Mpin) {
      return res.status(400).json({
        status: 400,
        message: "User with Reg. Number already created an MPIN.",
      });
    }

    // Create MPIN
    const createMpinQuery = `
      UPDATE tbl_login_Master 
      SET Mpin = ? 
      WHERE Reg_no = ? AND DOB = ?;
    `;
    const mpinValues = [mpin, reg_no.trim(), password.trim()];

    const [createdMpin] = await pool.query(createMpinQuery, mpinValues);

    // Check if update was successful
    if (createdMpin.affectedRows === 0) {
      return res.status(400).json({
        status: 400,
        message: "Failed to create an MPIN.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "MPIN created successfully",
    });
  } catch (error) {
    console.error(
      "Error occurred while creating the MPIN in createMpinController: ",
      error
    );
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// Change Mpin controller
export const changeMpinController = async (req, res) => {
  try {
    const { reg_no, password, oldMpin, newMpin } = req.body;

    // validate the input
    if (!reg_no) {
      return res
        .status(400)
        .json({ status: 400, message: "Registration Number is Required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ status: 400, message: "Password is Required" });
    }
    if (!oldMpin) {
      return res
        .status(400)
        .json({ status: 400, message: "Old Mpin is Required" });
    }
    if (!newMpin) {
      return res
        .status(400)
        .json({ status: 400, message: "New Mpin is Required" });
    }

    // search query
    const searchUserQuery = `SELECT * FROM tbl_login_Master WHERE Reg_no = ? AND DOB = ? AND Mpin = ?`;
    const searchValues = [reg_no.trim(), password.trim(), oldMpin]; // using password as DOB for now

    const [user] = await pool.query(searchUserQuery, searchValues);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message:
          "User Not Found. Please enter a valid Reg. No. and DOB. and old Mpin",
      });
    }

    // change mpin
    const changeMpinQuery = `
     UPDATE tbl_login_Master 
     SET Mpin = ? 
     WHERE Reg_no = ? AND DOB = ?;
   `;
    const mpinValues = [newMpin, reg_no.trim(), password.trim()];

    const [changedMpin] = await pool.query(changeMpinQuery, mpinValues);

    // Check if update was successful
    if (changedMpin.affectedRows === 0) {
      return res.status(400).json({
        status: 400,
        message: "Failed to change the MPIN.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "MPIN changed successfully successfully",
    });
  } catch (error) {
    console.error(
      "Error occurred while Change the MPIN in changeMpinController: ",
      error
    );
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// get user Details
export const getUserDetailsController = async (req, res) => {
  try {
    const { reg_no } = req.params; // Use req.params to get the registration number from the route

    // Input validation
    if (!reg_no) {
      return res
        .status(400)
        .json({ status: 400, message: "Registration Number is Required" });
    }

    // MySQL query for user validation
    const searchUserDetailsQuery = `SELECT * FROM tbl_login_Master WHERE Reg_no = ?`;
    const searchValues = reg_no.trim();

    // Execute query
    const [userDetails] = await pool.query(searchUserDetailsQuery, searchValues);

    // If user not found
    if (userDetails.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `User Details with Registration Number ${reg_no} not found.`,
      });
    }

    // Success response
    return res.status(200).json({
      status: 200,
      message: "User Details Fetched Successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Error occurred while getting user details: ", error.message || error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// forget Mpin controller
export const forgetMpinController = async (req, res) => {
  try {
    // Fetch the data from the body
    const { reg_no, password, mpin } = req.body;

    // Validate the input
    if (!reg_no) {
      return res.status(400).json({
        status: 400,
        message: "Registration Number is Required",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: 400,
        message: "Password is Required",
      });
    }

    if (!mpin) {
      return res.status(400).json({
        status: 400,
        message: "MPIN is required",
      });
    }

    // MySQL query for user validation
    const searchUserQuery = `SELECT * FROM tbl_login_Master WHERE Reg_no = ? AND DOB = ?`;
    const searchValues = [reg_no.trim(), password.trim()]; // using password as DOB for now

    const [user] = await pool.query(searchUserQuery, searchValues);

    // If user not found
    if (user.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found. Please enter a valid Reg. No. and DOB.",
      });
    }

    // Create MPIN
    const createMpinQuery = `
      UPDATE tbl_login_Master 
      SET Mpin = ? 
      WHERE Reg_no = ? AND DOB = ?;
    `;
    const mpinValues = [mpin, reg_no.trim(), password.trim()];

    const [createdMpin] = await pool.query(createMpinQuery, mpinValues);

    // Check if update was successful
    if (createdMpin.affectedRows === 0) {
      return res.status(400).json({
        status: 400,
        message: "Failed to create MPIN.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "New MPIN created successfully",
    });
  } catch (error) {
    console.error("Error occurred in forgetMpinController: ", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
