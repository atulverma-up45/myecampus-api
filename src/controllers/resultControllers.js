import { pool } from "../config/database/connectToDB.js";

export const getUserResultController = async (req, res) => {
  try {
    const { reg_no, month, dob, year } = req.body;

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
    if (!year) {
      return res.status(400).json({
        status: 400,
        message: "Year is required.",
      });
    }

    const userDetailsQuery = `
       SELECT reg_no, name, dob, phone_no, college_code, course, degree, branch, semester, part, month, year
       FROM 
         tbl_Result
       WHERE 
         reg_no = ? 
         AND dob = ? AND month = ? AND year = ?
       LIMIT 1`;

    const resultDetailsQuery = `
       SELECT subject_code, title, secured_cia, secured_esc, secured_total, secured_result, grade, resulttype
       FROM 
         tbl_Result
       WHERE 
         reg_no = ? 
         AND dob = ? AND month = ? AND year = ?`;

    const searchValues = [reg_no.trim(), dob.trim(), month.trim(), year.trim()];

    const [userDetails] = await pool.query(userDetailsQuery, searchValues);

    const [resultDetails] = await pool.query(resultDetailsQuery, searchValues);

    if (userDetails.length === 0 && resultDetails.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `No result found for the provided student details (reg_no: ${reg_no}, dob: ${dob}, month: ${month}, year: ${year}).`,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Student Result details fetched successfully.",
      userDetails: userDetails[0] || {},
      resultDetails: resultDetails || [],
    });
  } catch (error) {
    console.error(
      "Error occurred while fetching student result details:",
      error
    );
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
    });
  }
};
