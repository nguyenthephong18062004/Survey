import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all semesters
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM semesters');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a semester
router.post('/', async (req, res) => {
  const { name, startDate, endDate, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO semesters (name, startDate, endDate, status) VALUES (?, ?, ?, ?)',
      [name, startDate, endDate, status || 'upcoming']
    );
    
    const [newSemester] = await pool.query('SELECT * FROM semesters WHERE id = ?', [result.insertId]);
    res.status(201).json(newSemester[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a semester
router.put('/:id', async (req, res) => {
  const { name, startDate, endDate, status } = req.body;
  try {
    await pool.query(
      'UPDATE semesters SET name=?, startDate=?, endDate=?, status=? WHERE id=?',
      [name, startDate, endDate, status, req.params.id]
    );
    
    const [updatedSemester] = await pool.query('SELECT * FROM semesters WHERE id = ?', [req.params.id]);
    if (updatedSemester.length === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    res.json(updatedSemester[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a semester
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM semesters WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    res.json({ message: 'Semester deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
