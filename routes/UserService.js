const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

// GET all rows
router.oUserServices = async (req, res) => {
    const detailService =  { applicationHeaderServices: ['validateLoginUser', 'service2', 'Usservice3er3'] };
    res.json(detailService);
}
 

router.validateLoginUser = async (req, res) => {
    const { username, password } = req.body;

  if (!username || !password) {
    return response.error(res, 400, 'Username and password are required.');
  }
  try {
    const query = `
      SELECT name,lastname, status 
      FROM users 
      WHERE username = $1 AND password = $2
      LIMIT 1
    `;
    const values = [username, password];
  console.log(values)
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 401, 'Invalid username or password.');
    }
    const user = result.rows[0];
    if (user.status.toLowerCase() !== 'active') {
      return response.error(res, 403, `User status is ${user.status}. Access denied.`);
    }
    return response.success(res, 200, `Login successful, ${user.name}, ${user.lastname}. Navigating to home page.`);

  } catch (err) {
    console.error('Database error during login:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
}
router.getLoginUserMenu = async (req, res) => {
             const { username } = req.body;
       
  if (!username ) {
    return response.error(res, 400, 'Username are required.');
  }
  try {
    const query = `
      SELECT m.menu, m.label, m.path,m.status AS menu_active, ua.mode 
	FROM userassigments ua JOIN menu m ON ua.key = m.menu  
	WHERE ua.username =$1 AND ua.name = 'MENU'
    `;
    const values = [username];
  console.log(values)
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 401, 'Invalid username.');
    }
   response.success(res, 200, 'Expense category fetched successfully.',  result.rows);
    

  } catch (err) {
    console.error('Database error during login:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
}

 
module.exports = router;
