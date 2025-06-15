const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

const MODULE_NAME = 'ExpenseTracker';
const DEFAULT_DUE_DAYS = 5;
  
 

router.getAllEvents = async (req, res) => {
    const { username } = req.body;

   
  if (!username ) {
    return response.error(res, 400, 'Username are required.');
  }
  try {
    const query = `
      SELECT  title,description as text,type,icon,startdate as "startDate",enddate as "endDate"  FROM calenderEvents  WHERE username = $1 `;
    const values = [username];
 
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 401, 'No Remainder found for username.');
    }
    return response.success(res, 200, 
      ' Remainder fetched successfully.',
      result.rows
    );
   
  } catch (err) { 
    console.error('Database error during login:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
}  
module.exports = router;
