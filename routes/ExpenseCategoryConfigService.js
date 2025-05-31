const express = require('express');
const router = express.Router();
const pool = require('../db');
const handleError = require('../utils/errorHandler');
const response = require('../utils/responseHandler'); // Use response helper

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
  // const  username  = req.headers['x-username']; 
  // const  id  = req.headers['x-id']; // Get the ID from the URL parameter
     const { username,id } = req.body;
  
  if (!id || !username) {
    return response.error(res, 400, 'Expense category ID and Username is required.');
  }

  try {
    const query = `
      SELECT *
      FROM ExpenseCategoryConfig
      WHERE id = $1 AND status = 'Active' and username = $2
      LIMIT 1
    `;
    
    const result = await pool.query(query, [id,username]);

    if (result.rows.length === 0) {
      return response.error(res, 404, 'Expense category not found or inactive.');
    }

    return response.success(res, 200, 'Expense category fetched successfully.',  result.rows[0]);
    
  } catch (err) {
    console.error('Error fetching expense category:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};

router.insertExpenseCategoryConfig = async (req, res) => {
  try {
    const {
     username, category, subcategory, importance, yearlimit, monthlimit, weeklimit, 
     dailylimit, suggestions, notes, recurring, recurringtype, recurringevery, remainder, status
    } = req.body;

    if (!username || !category || !subcategory) {
      return response.error(res, 400, 'Required fields missing.', 'username, category, and subcategory are mandatory.');
    }

    const query = `
      INSERT INTO ExpenseCategoryConfig (
        username,category,subcategory,importance,yearlimit,monthlimit,weeklimit,dailylimit,suggestions,notes,recurring,
        recurringtype,recurringevery,isreminder,status,created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16
      )
      
    `;

    const values = [
     username, category, subcategory, importance, parseInt(yearlimit) || 0, parseInt(monthlimit) || 0, parseInt(weeklimit) || 0, 
     parseInt(dailylimit) || 0, suggestions, notes, recurring === true || recurring === 'true', recurringtype, parseInt(recurringevery) 
     || 0, remainder === true ||  remainder === 'true', status || 'Active',   username // created_by & modified_by = username
    ];

    const result = await pool.query(query, values);

    return response.success(res, 201, {
      message: 'Expense category config created successfully.',
      id: ""//result.rows[0].id
    });

  } catch (err) {
    console.error('Error inserting ExpenseCategoryConfig:', err);
    return response.error(res, 500, 'Internal server error.', err.message);
  }
};
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
      notes,
      recurring,
      recurringtype,
      recurringevery,
      isreminder,
      status,
      username,
          id
    } = req.body;

    if (!id || !username || !category || !subcategory) {
      return response.error(res, 400, 'Required fields missing.', 'id, username, category, and subcategory are mandatory.');
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
      notes,
      recurring === true || recurring === 'true',
      recurringtype,
      recurringevery,
      isreminder === true || isreminder === 'true',
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
      WHERE username = $1 AND category = $2 AND subcategory = $3
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
