const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

const MODULE_NAME = 'ExpenseTracker';
const DEFAULT_DUE_DAYS = 5;
 
// GET all rows
router.oReminderServices = async (req, res) => {
    const detailService =  { applicationHeaderServices: ['getUpcomingReminders', 'getMissedReminders', 'next'] };
    res.json(detailService);
}
 
 

router.getMissedReminders = async (req, res) => {
    const { username, modulename } = req.body;

   
  if (!username || !modulename) {
    return response.error(res, 400, 'Username and modulename are required.');
  }
  try {
    const query = `
      SELECT *  FROM (
    SELECT DISTINCT ON (title) *
    FROM reminderevents  WHERE username = $1 
      AND module_name = $2 AND status = 'Missed'
      AND remind_at >= NOW() - INTERVAL '1 month'
      AND remind_at < NOW()
    ORDER BY title, remind_at DESC
) AS a 
ORDER BY remind_at DESC    `;
    const values = [username, modulename];
 
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 401, 'No Remainder found for username & modulename.');
    }
    return response.success(res, 200, 
      'Missed Remainder fetched successfully.',
      result.rows
    );
   
  } catch (err) { 
    console.error('Database error during login:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
} 
router.getUpcomingReminders = async (req, res) => {
    const { username, modulename } = req.body;

   
  if (!username || !modulename) {
    return response.error(res, 400, 'Username and modulename are required.');
  }
  try {
    const query = `
      select * from (SELECT DISTINCT ON (title) *
FROM reminderevents
WHERE username = $1  AND module_name = $2
  AND status = 'Upcoming'  AND remind_at >= NOW()
ORDER BY title, remind_at asc) as a order by remind_at asc
    `;
    const values = [username, modulename];
 
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 401, 'No Reminder fouund for username & modulename.');
    }

    return response.success(res, 200, 
    'Upcoming Remainder fetched successfully.',
    result.rows
  );
  } catch (err) { 
    console.error('Database error during login:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
} 
 

router.markAsCompleted = async (req, res) => { 
    const { id } = req.body;

    if (!id) {
        return response.error(res, 400, 'Reminder ID is required.');
    }

    try {
        const query = `
            UPDATE reminderevents
            SET status = 'Completed', updated_on = NOW()
            WHERE id = $1
        `;
        const values = [id];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return response.error(res, 404, 'Reminder not found or already completed.');
        }

        return response.success(res, 200, 'Reminder marked as completed.');
    } catch (err) {
        console.error('Error completing reminder:', err);
        return response.error(res, 500, 'Internal server error.');
    }
}

router.snoozeReminder = async (req, res) => { 
    const { id, newRemindAt } = req.body;

    if (!id || !newRemindAt) {
        return response.error(res, 400, 'Reminder ID and new remind_at date are required.');
    }

    try {
 
        const newEndDate = new Date(newRemindAt);
        newEndDate.setDate(newEndDate.getDate() + DEFAULT_DUE_DAYS);

        const updateQuery = `
            UPDATE reminderevents 
            SET remind_at = $1,
                remainder_end = $2,
                status = 'Upcoming'
            WHERE id = $3
        `;
        const updateValues = [newRemindAt, newEndDate, id];

        await pool.query(updateQuery, updateValues);

        return response.success(res, 200, "Reminder snoozed successfully.");
    } catch (err) {
        console.error('Error snoozing reminder:', err);
        return response.error(res, 500, 'Failed to snooze reminder. Try again later.');
    }
}



module.exports = router;
