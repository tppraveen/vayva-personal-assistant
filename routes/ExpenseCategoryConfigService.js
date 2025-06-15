const express = require('express');
const router = express.Router();
const pool = require('../db'); 
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper
 
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

// GET all rows 
router.oExpenseCategoryConfigServices = async (req, res) => {
    const detailService =  { ExpenseCategoryConfigService: ['getExpenseListsbyUser', 'service2', 'Usservice3er3'] };
    res.json(detailService);
}
 


router.getExpenseCategoryConfigListsbyUser = async (req, res) => {
  console.log(req.body)
            const { username } = req.body;
  

  if (!username) {
    return response.error(res, 400, 'Username is required.');
  }

  try {
    const query = `
      SELECT *
      FROM ExpenseCategoryConfig
      WHERE username = $1 AND status = 'Active' 
      order by modified_on desc 
    `;
    const values = [username];

    const result = await pool.query(query, values);

    return response.success(res, 200, 
       'Expense category config list fetched successfully.',
      result.rows
    );

  } catch (err) {
    console.error('Database error while fetching ExpenseCategoryConfig:', err);
    return response.error(res, 500, 'Internal server error. Please try again later.');
  }
     
}
router.readExpenseCategoryByID = async (req, res) => {
  const { username, id } = req.body;

  if (!id || !username) {
    return response.error(res, 400, 'Expense category ID and Username is required.');
  }

  try {
    // Fetch Expense Category
    const categoryQuery = `
      SELECT *  FROM ExpenseCategoryConfig 
      WHERE id = $1 AND status = 'Active' 
      AND username = $2 LIMIT 1`;
    const categoryResult = await pool.query(categoryQuery, [id, username]);

    if (categoryResult.rows.length === 0) {
      return response.error(res, 404, 'Expense category not found or inactive.');
    }

    const category = categoryResult.rows[0];

    // Fetch related Reminder
    const reminderQuery = `
      SELECT *, TO_CHAR(remainder_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata', 'DD-MM-YYYY HH12:MI:SS AM') AS remainder_at

      FROM expenseRemainder
      WHERE expense_category_id = $1 AND username = $2
      ORDER BY created_on DESC
      LIMIT 1
    `;
    const reminderResult = await pool.query(reminderQuery, [id, username]);

    if (reminderResult.rows.length > 0) {
      category.reminder = reminderResult.rows[0]; // Attach the reminder
    } else {
      category.reminder = null;
    }

    return response.success(res, 200, 'Expense category fetched successfully.2', category);

  } catch (err) {
    console.error('Error fetching expense category:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};
 
// ✅ Controller: insertExpenseCategoryConfig
router.insertExpenseCategoryConfig = async (req, res) => {
   try {
    const {
      username, category, subcategory, importance, yearlimit, monthlimit, weeklimit,
      dailylimit, suggestions,  recurring, recurringtype, recurringevery,
       status, remainderData
    } = req.body;
    if(!remainderData.is_recurring){
      remainderData.repeat_type='Once'
    }
     

    if (!username || !category || !subcategory) {
      return response.error(res, 400, 'Required fields missing.', 'username, category, and subcategory are mandatory.');
    }

 
    const insertExpenseQuery = `
      INSERT INTO ExpenseCategoryConfig (
        username, category, subcategory, importance, yearlimit, monthlimit, weeklimit, dailylimit,
        suggestions, notes, recurring, recurringtype, recurringevery, isreminder, status, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16
      )
      RETURNING id;
    `;

    const expenseValues = [
      username, category, subcategory, importance,
      parseInt(yearlimit) || 0, parseInt(monthlimit) || 0,
      parseInt(weeklimit) || 0, parseInt(dailylimit) || 0,
      suggestions, "",
      recurring === true || recurring === 'true',
      recurringtype, parseInt(recurringevery) || 0,
      false,
      status || 'Active', username
    ];

    const result =  await pool.query(insertExpenseQuery, expenseValues);
    const expenseId = result.rows[0].id;

   

 
    return response.success(res, 201, {
      message: 'Expense category config created successfully.',
      id: expenseId
    });

  } catch (err) {
   // await client.query('ROLLBACK');
    console.error('Error inserting ExpenseCategoryConfig:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  } finally {
    //client.release();
  }
};
 function formatDateToDDMMYYYY(dateInput) {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
  
router.updateExpenseCategoryConfig = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      importance,
      yearlimit,
      monthlimit,
      weeklimit,
      dailylimit,
      suggestions,
       recurring,
      recurringtype,
      recurringevery,
       status,
      username,
          id,remainderData
    } = req.body;

    if (!id || !username || !category || !subcategory) {
      return response.error(res, 400, 'Required fields missing.', 'id, username, category, and subcategory are mandatory.');
    }
if(!remainderData.is_recurring){
      remainderData.repeat_type='Once'
    }

    const query = `
      UPDATE ExpenseCategoryConfig
      SET 
        category = $1,
        subcategory = $2,
        importance = $3,
        yearlimit = $4,
        monthlimit = $5,
        weeklimit = $6,
        dailylimit = $7,
        suggestions = $8,
        notes = $9,
        recurring = $10,
        recurringtype = $11,
        recurringevery = $12,
        isreminder = $13,
        status = $14,
        modified_by = $15,modified_on = CURRENT_TIMESTAMP
      WHERE id = $16 AND username = $17
      RETURNING id
    `;
  
    const values = [
      category,
      subcategory,
      importance,
      yearlimit ,
      monthlimit,
      weeklimit,
      dailylimit,
      suggestions,
      "",
      recurring === true || recurring === 'true',
      recurringtype,
      recurringevery,
      false,
      status || 'Active',
      username, // modified_by
      id,
      username  // where username = ?
    ];
//console.log(values)
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return response.error(res, 404, 'Record not found or unauthorized.');
    }
     
    return response.success(res, 200, {
      message: 'Expense category config updated successfully.',
      id: result.rows[0].id
    });

  } catch (err) {
    console.error('Error updating ExpenseCategoryConfig:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};
router.deleteExpenseCategoryConfig = async (req, res) => {
  try {
    const { username, category, subcategory } = req.body;

    if (!username || !category || !subcategory) {
      return response.error(res, 400, 'username, category, and subcategory are required.');
    }

    // Step 1: Check if category+subcategory exists in Expense table
    const expenseCheckQuery = `
      SELECT COUNT(*) 
      FROM expensetracker 
      WHERE username = $1 AND category = $2 AND subcategory = $3 and status!='Deleted'
    `;

    const expenseResult = await pool.query(expenseCheckQuery, [username, category, subcategory]);

    if (parseInt(expenseResult.rows[0].count) > 0) {
      return response.error(res, 409, 'This category is already used in expenses. Please delete associated expenses first.');
    }

    // Step 2: Delete from ExpenseCategoryConfig
    const deleteQuery = `
      DELETE FROM ExpenseCategoryConfig
      WHERE username = $1 AND category = $2 AND subcategory = $3
      RETURNING id
    `;

    const deleteResult = await pool.query(deleteQuery, [username, category, subcategory]);

    if (deleteResult.rowCount === 0) {
      return response.error(res, 404, 'Expense category config not found.');
    }

    return response.success(res, 200, {
      message: 'Expense category config deleted successfully.',
      id: deleteResult.rows[0].id
    });

  } catch (err) {
    console.error('Error deleting ExpenseCategoryConfig:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};




router.getCategoryListsByUser = async (req, res) => {
    const { username } = req.body;

  if (!username) {
    return response.error(res, 400, 'Username is required.', 'Missing query parameter: username.');
  }

  try {
    const query = `
      SELECT DISTINCT category
      FROM ExpenseCategoryConfig
      WHERE username = $1 AND status = 'Active'
    `;
    const values = [username];

    const result = await pool.query(query, values);
const categories = result.rows.map(row => ({ category: row.category }));

return response.success(res, 200, 'Category list fetched successfully.', categories);

  } catch (err) {
    console.error('Error fetching categories:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};
router.getSubCategoryListsByUser = async (req, res) => {
          
           
    const { username, category } = req.body;

  if (!username|| !category) {
    return response.error(res, 400, 'Username is required.', 'Missing query parameter: username.');
  }
  if ( !category) {
    return response.error(res, 400, 'Category is required.', 'Missing query parameter: Category.');
  }

  try {
    const query = `
      SELECT DISTINCT subcategory
      FROM ExpenseCategoryConfig
      WHERE username = $1 AND status = 'Active' and category=$2
    `;
    const values = [username,category];

   const result = await pool.query(query, values);
const categories = result.rows.map(row => ({ subcategory: row.subcategory }));

return response.success(res, 200, 'Sub Category list fetched successfully.', categories);



  } catch (err) {
    console.error('Error fetching categories:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};
















 
module.exports = router;
