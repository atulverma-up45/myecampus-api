import { pool } from "../config/database/connectToDB.js";

export const getUserHallTicketDetailsController = async (req, res) => {
  try {
    const { reg_no, month, dob, year } = req.body;

    // Validation for required fields
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

    const searchValues = [reg_no.trim(), dob, month.trim(), year.trim()];

    // Static User Details Query
    const userDetailsQuery = `
      SELECT reg_no, name, course, course_id, degree, branch, meduim, section, batch, dob, gender, photo, syllabus, semester, display_semester, College_code, roll_no
      FROM tbl_HallTicket
      WHERE reg_no = ? AND dob = ? AND month = ? AND year = ? LIMIT 1`;

    // Hall Ticket Details Query
    const hallTicketDetailsQuery = `
      SELECT subject_Type, sub_code, title, credit, Max_CIA, Max_ESE, Max_TOT, sub_order, part, Exam_date, SESSION, result_status, hallticket_block, count_dept_id, dept_coure_id
      FROM tbl_HallTicket
      WHERE reg_no = ? AND dob = ? AND month = ? AND year = ?`;

    // Fetching static user details
    const [userDetails] = await pool.query(userDetailsQuery, searchValues);

    // Fetching hall ticket details
    const [hallTicketDetails] = await pool.query(hallTicketDetailsQuery, searchValues);

    // Check if data exists
    if (userDetails.length === 0 && hallTicketDetails.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No hall ticket found for the provided details.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Hall ticket details fetched successfully.",
      userDetails: userDetails[0],  // Return only the first record for user details
      hallTicketDetails: hallTicketDetails,  // Return all hall ticket details
    });
  } catch (error) {
    console.error("Error occurred while fetching hall ticket details:", error);
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
    });
  }
};
