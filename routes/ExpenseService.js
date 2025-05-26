const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

// GET all rows
router.oExpenseServices = async (req, res) => {
    const detailService =  { ExpenseService: ['getExpenseListsbyUser', 'service2', 'Usservice3er3'] };
    res.json(detailService);
}
 


router.getExpenseListsbyUser = async (req, res) => {
            const { username } = req.body;
  

  if (!username) {
    return response.error(res, 400, 'Username is required.');
  }

  try {
    const query = `
      SELECT *,TO_CHAR(transactiontime, 'DD/MM/YYYY HH24:MI') AS transactiontime
      FROM expensetracker
      WHERE username = $1 AND status = 'Active'
    `;
    const values = [username];

    const result = await pool.query(query, values);

    return response.success(res, 200, 
       'Expense  list fetched successfully.',
      result.rows
    );

  } catch (err) {
    console.error('Database error while fetching Expense:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
} 


router.readExpenseByID = async (req, res) => {
  const  username  = req.headers['x-username']; 
  const  id  = req.headers['x-id']; // Get the ID from the URL parameter
  
  if (!id || !username) {
    return response.error(res, 400, 'Expense ID and Username is required.');
  }

  try {
    const query = `
      SELECT *
      FROM expensetracker
      WHERE id = $1 AND status = 'Active' and username = $2
      LIMIT 1
    `;
    
    const result = await pool.query(query, [id,username]);

    if (result.rows.length === 0) {
      return response.error(res, 404, 'Expense not found or inactive.');
    }

    return response.success(res, 200, 'Expense fetched successfully.',  result.rows[0]);
    
  } catch (err) {
    console.error('Error fetching expense category:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};


router.insertExpense = async (req, res) => {
           //const username = req.headers['x-username'];
  try {
    const {
      id,
      datetime,
      type,
      payment_mode,
      is_planned,
      category,
      sub_category,
      amount,
      payment_status,
      description,
      impact_saving,
      cycle,
      merchant_name,
      with_whom,
      notes,
      expense_mood,
      username
    } = req.body;
console.log(req.body)
  console.log(datetime +"--"+ type +"--"+ amount  +"--"+ category +"--"+ username)

    if (!datetime || !type || !amount || !category || !username) {
      return response.error(res, 400, 'Required fields are missing.');
    }
    
    // Determine flow
    let flow;
    if (type.toLowerCase() === 'expense') flow = 'Debit';
    else if (type.toLowerCase() === 'income') flow = 'Credit';
    else if (type.toLowerCase() === 'transfer') flow = 'Transfer';
    else flow = 'Other';

    // Parse timestamp and date
    const transactionDate = new Date(datetime).toISOString().split('T')[0]; // yyyy-mm-dd
    const transactionTime = new Date(datetime); // full timestamp

    // Convert "Yes"/"No" to booleans
    const isPlannedBool = is_planned === 'Yes';
    const impactSavingBool = impact_saving === 'Yes';

    const query = `
      INSERT INTO expensetracker (
        transactiontime,
        transactiondate,
        username,
        category,
        subcategory,
        description,
        amount,
        cycle,
        type,
        flow,
        payment_mode,
        is_planned,
        saving_impact,
        with_whom,
        notes,
        merchant_name,
        expense_mood,
        payment_status,
        status,
        created_by
      ) VALUES (
        $1, $2, $18,$3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, 'Active', $18
      )
    `;

    const values = [
      transactionTime,
      transactionDate,
      category,
      sub_category,
      description,
      parseFloat(amount),
      cycle,
      type,
      flow,
      payment_mode,
      isPlannedBool,
      impactSavingBool,
      with_whom,
      notes,
      merchant_name,
      expense_mood,
      payment_status,
      username
    ];
    console.log(query+"/n"+values)
    const result = await pool.query(query, values);

    return response.success(res, 201,'Expense details added successfully.');

  } catch (err) {
    console.error('Error inserting expense record:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};
router.updateExpense = async (req, res) => {
  const { id } = req.params; // Get the expense ID from the URL parameter
  const {
    datetime,
    type,
    payment_mode,
    is_planned,
    category,
    sub_category,
    amount,
    payment_status,
    description,
    impact_saving,
    cycle,
    merchant_name,
    with_whom,
    notes,
    expense_mood,
    username
  } = req.body;

  if (!id || !username) {
    return response.error(res, 400, 'Expense ID and username are required.');
  }

  try {
    // Determine flow based on type
    let flow;
    if (type.toLowerCase() === 'expense') flow = 'Debit';
    else if (type.toLowerCase() === 'income') flow = 'Credit';
    else if (type.toLowerCase() === 'transfer') flow = 'Transfer';
    else flow = 'Other';

    // Parse timestamp and date
    const transactionDate = new Date(datetime).toISOString().split('T')[0]; // yyyy-mm-dd
    const transactionTime = new Date(datetime); // full timestamp

    // Convert "Yes"/"No" to booleans
    const isPlannedBool = is_planned === 'Yes';
    const impactSavingBool = impact_saving === 'Yes';

    const query = `
      UPDATE expensetracker
      SET 
        transactiontime = $1,
        transactiondate = $2,
        category = $3,
        subcategory = $4,
        description = $5,
        amount = $6,
        cycle = $7,
        type = $8,
        flow = $9,
        payment_mode = $10,
        is_planned = $11,
        saving_impact = $12,
        with_whom = $13,
        notes = $14,
        merchant_name = $15,
        expense_mood = $16,
        payment_status = $17,
        modified_by = $18,
        modified_on = CURRENT_TIMESTAMP
      WHERE id = $19 AND status = 'Active'
      RETURNING id
    `;

    const values = [
      transactionTime,
      transactionDate,
      category,
      sub_category,
      description,
      parseFloat(amount),
      cycle,
      type,
      flow,
      payment_mode,
      isPlannedBool,
      impactSavingBool,
      with_whom,
      notes,
      merchant_name,
      expense_mood,
      payment_status,
      username,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 404, 'Expense not found or inactive.');
    }

    return response.success(res, 200, {
      message: 'Expense record updated successfully.',
      id: result.rows[0].id
    });

  } catch (err) {
    console.error('Error updating expense record:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};

router.deleteExpense = async (req, res) => {
  const { id } = req.params; // Get the expense ID from the URL parameter
  const { username } = req.body; // The user who is performing the deletion

  if (!id || !username) {
    return response.error(res, 400, 'Expense ID and username are required.');
  }

  try {
    const query = `
      UPDATE expensetracker
      SET 
        status = 'Deleted',
        deleted_by = $1,
        deleted_on = CURRENT_TIMESTAMP
      WHERE id = $2 AND status = 'Active'
      RETURNING id
    `;

    const values = [username, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return response.error(res, 404, 'Expense not found or already deleted.');
    }

    return response.success(res, 200, {
      message: 'Expense record marked as deleted successfully.',
      id: result.rows[0].id
    });

  } catch (err) {
    console.error('Error deleting expense record:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};






 
module.exports = router;
