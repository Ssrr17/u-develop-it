const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//Get all candidates query
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//   console.log(rows);
// });
//Get all candidates API query
router.get("/candidates", (req, res) => {
    // const sql = `SELECT * FROM candidates`;...OLD query route
    const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });
  
  // Get a single candidate API query
  router.get("/candidates/:id", (req, res) => {
    // const sql = `SELECT * FROM candidates WHERE id = ?`; ....OLD query with ID route
    const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id
               WHERE candidates.id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: row,
      });
    });
  });
  
  // db.query(`SELECT * FROM candidates WHERE id = 2`, (err, row) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(row);
  // });
  
  
  //Delete a candidate query
  // db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(result);
  // });
  
  // Delete a candidate api query
  router.delete("/candidates/:id", (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message });
      } else if (!result.affectedRows) {
        res.json({
          message: "Candidate not found",
        });
      } else {
        res.json({
          message: "deleted",
          changes: result.affectedRows,
          id: req.params.id,
        });
      }
    });
  });
  //Create a candidate
  // const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
  //               VALUES (?,?,?,?)`;
  // const params = [1, 'Ronald', 'Firbank', 1];
  
  // db.query(sql, params, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(result);
  // });
  //Create a candidate
  router.post("/candidates", ({ body }, res) => {
    const errors = inputCheck(
      body,
      "first_name",
      "last_name",
      "industry_connected"
    );
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
    
  });

// Update a candidate's party
router.put('/api/candidates/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
  
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });
  module.exports = router;