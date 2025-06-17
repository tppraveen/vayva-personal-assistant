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
      SELECT  id,title,description as text,type,icon,startdate as "startDate",enddate as "endDate"  FROM calenderEvents  WHERE username = $1 `;
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


router.insertEvents = async (req, res) => {
  const events = req.body;
  console.log(events)
  if (!Array.isArray(events) || events.length === 0) {
    return response.error(res, 400, 'Payload must be a non-empty array.');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const event of events) {
      const {
        username,
        title,
        description,
        icon,
        type,
        fromDateTime,
        toDateTime,
      } = event;

      if (!username || !title || !fromDateTime || !toDateTime) {
        await client.query('ROLLBACK');
        return response.error(res, 400, 'Missing required fields in one or more events.');
      }

      const insertQuery = `
        INSERT INTO calenderEvents (
          username, title, description, icon, type, startdate, enddate, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      const values = [
        username,
        title,
        description,
        icon,
        type,
        fromDateTime,
        toDateTime,
        username // Assuming created_by is same as username
      ];

      await client.query(insertQuery, values);
    }

    await client.query('COMMIT');
    return response.success(res, 201, 'Calendar events inserted successfully.', { status: 'success' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting calendar events:', error);
    return response.error(res, 500, 'Failed to insert calendar events.');
  } finally {
    client.release();
  }
};

router.deleteEvents = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return response.error(res, 400, 'Payload must contain a non-empty "ids" array.');
  }

  try {
    const placeholders = ids.map((_, idx) => `$${idx + 1}`).join(', ');
    const query = `DELETE FROM calenderEvents WHERE id IN (${placeholders})`;

    const result = await pool.query(query, ids);

    return response.success(res, 200, 'Events deleted successfully.', {
      deletedCount: result.rowCount,
      deletedIds: ids
    });

  } catch (err) {
    console.error('Database error during deleteEvents:', err);
    return response.error(res, 500, 'Internal server error while deleting events.');
  }
};


module.exports = router;
