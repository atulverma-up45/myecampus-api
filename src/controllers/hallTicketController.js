import { pool } from "../config/database/connectToDB.js";

export const getUserHallTicketDetailsController = async (req, res) => {
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

    const searchUserHallTicketQuery = `SELECT * FROM tbl_HallTicket WHERE reg_no = ? AND dob = ? AND month = ?`;
    const searchValues = [reg_no.trim(), dob, month.trim()];

    // Execute query
    const [userHallTickets] = await pool.query(
      searchUserHallTicketQuery,
      searchValues
    );

    if (userHallTickets.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No hall ticket found for the provided details.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Hall ticket details fetched successfully.",
      HallTicketsDetails: userHallTickets,
    });
  } catch (error) {
    console.error("Error occurred while fetching hall ticket details:", error);
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
    });
  }
};
