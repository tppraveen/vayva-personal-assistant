const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all rows
router.get('/', async (req, res) => {
 const detailService =  { users: ['User1', 'User2', 'User3'] };
    res.json(detailService);
}); 
// POST new row
// router.post('/', async (req, res) => {
//   const { name } = req.body;
//   const result = await pool.query('INSERT INTO my_table(name) VALUES($1) RETURNING *', [name]);
//   res.json(result.rows[0]);
// });
router.getAppHomeMenuTiles = async (req, res) => {
   
 

    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error('Error reading Excel:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = router;
