import { pool } from "../config/database/connectToDB.js";

export const getUserExamApplicationsController = async (req, res) => {
  try {
    const { reg_no, month, dob, year } = req.body;

    // Input validation
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

    // Query for static user details (common details)
    const userDetailsQuery = `
    SELECT 
      Roll_no, Reg_no, Name, Course, Course_Id, Degree, Branch, Meduim, Section, Batch, DOB, Gender, Community, 
      Caste, Religion, Nationality, Blood_Group, Personal_Identification, 
      Fathers_Name, Mothers_Name, Guardian_Name, 
      P_Add1, P_Add2, P_Add3, P_Add4, P_State, P_Pin_code, P_Phono, 
      C_Add1, C_Add2, C_Add3, C_Add4, C_State, C_Pin_code, C_Phono, 
      SP_Phono_NO, SS_Phono_NO, F_Phono_NO, M_Phono_NO, 
      Diff_abled, P1_subject, ECR_Subject, 
      F_Mail, M_Mail, S_Mail, EMSI, 
      Aadhaar, Voter, Pan, Student_Status, Later_Admission, 
      Photo, Syllabus, Semester, display_Semester, 
      dayscholar_hostel
    FROM 
      tbl_Exam_Application
    WHERE 
      Reg_no = ? 
      AND DOB = ?
    LIMIT 1`;

    // Query for exam application details (exam-specific details)
    const examApplicationsQuery = `
    SELECT 
      Reg_no, DOB, month, year, College_code, Roll_no, Course_order, 
      Sub_Code, Title, Credit, Max_CIA, Max_ESE, Max_TOT, 
      Paper_amount, Cost_Application, marksheet, consolidated_marksheet, 
      provisional_marksheet, miscellaneous, Total_Amount, 
      Count_theory, Count_Practical, Count_Project, Count_Internship, 
      Count_Internal_paper, Count_field_work, Count_ability_enhancement, 
      Amount_theory, Amount_Practical, Amount_Project, Amount_Internship, 
      Amount_Internal_paper, Amount_field_work, Amount_ability_enhancement, 
      sub_order, part, Practical_Hrs, Arrear_regular, written_paper
    FROM 
      tbl_Exam_Application
    WHERE 
      Reg_no = ? 
      AND DOB = ? 
      AND month = ? 
      AND year = ?`;

    const searchValues = [reg_no.trim(), dob.trim(), month.trim(), year.trim()];

    // Execute query for user details
    const [userDetails] = await pool.query(userDetailsQuery, [
      reg_no.trim(),
      dob.trim(),
    ]);

    // Execute query for exam applications
    const [examApplicationsDetails] = await pool.query(
      examApplicationsQuery,
      searchValues
    );

    // Check if user details and exam applications are found
    if (userDetails.length === 0 && examApplicationsDetails.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No Exam Application found for the provided details.",
      });
    }

    // Send successful response with separate user and exam details
    return res.status(200).json({
      status: 200,
      message: "User Exam Applications details fetched successfully.",
      userDetails: userDetails[0] || {}, 
      examApplicationsDetails: examApplicationsDetails || [], 
    });
  } catch (error) {
    console.error(
      "Error occurred while fetching user Exam Applications details:",
      error
    );
    return res.status(500).json({
      status: 500,
      message: "An internal server error occurred.",
    });
  }
};
