import { pool } from "../config/database/connectToDB.js";

export const getUserExamApplicationsController = async (req, res) => {
  try {
    const { reg_no, month, dob } = req.body;
    if (!reg_no) {
      return res.status(400).json({
        status: 400,
        message: "Registration Number is required.",
      });
    }
    if (!month) {
      return res.status(400).json({
        status: 400,
        message: "Month is required.",
      });
    }
    if (!dob) {
      return res.status(400).json({
        status: 400,
        message: "Date of Birth is required.",
      });
    }

    const searchExamApplicationsQuery = `SELECT * FROM tbl_Exam_Application WHERE Reg_no = ? AND DOB = ? AND month = ?`;
    const searchValues = [reg_no.trim(), dob, month.trim()];

    // Execute query
    const [userExamApplications] = await pool.query(
      searchExamApplicationsQuery,
      searchValues
    );

    if (userExamApplications.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No Exam Application found for the provided details.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "User Exam Applications details fetched successfully.",
      userExamApplications
    });
  } catch (error) {
    console.error(
      "Error occurred while fetching user Exam Applications ticket details:",
      error
    );
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
    });
  }
};
