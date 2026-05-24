import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Get all active subjects
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE isDeleted = FALSE');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ? AND isDeleted = FALSE', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a subject
router.post('/', async (req, res) => {
  const { code, name, credits, description, lecturerName, lecturerEmail, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO subjects (code, name, credits, description, lecturerName, lecturerEmail, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [code, name, credits || 0, description || '', lecturerName || '', lecturerEmail || '', status || 'active']
    );
    
    const [newSubject] = await pool.query('SELECT * FROM subjects WHERE id = ?', [result.insertId]);
    res.status(201).json(newSubject[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a subject
router.put('/:id', async (req, res) => {
  const { code, name, credits, description, lecturerName, lecturerEmail, status } = req.body;
  try {
    await pool.query(
      'UPDATE subjects SET code=?, name=?, credits=?, description=?, lecturerName=?, lecturerEmail=?, status=? WHERE id=?',
      [code, name, credits, description, lecturerName, lecturerEmail, status, req.params.id]
    );
    
    const [updatedSubject] = await pool.query('SELECT * FROM subjects WHERE id = ?', [req.params.id]);
    if (updatedSubject.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(updatedSubject[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a subject (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE subjects SET isDeleted = TRUE WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
