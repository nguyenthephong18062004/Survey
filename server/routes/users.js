import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, username, name as fullName, role, department, status, createdAt as createdDate, lastLogin FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  const { email, username, fullName, role, department, password } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (email, username, password, name, role, department) VALUES (?, ?, ?, ?, ?, ?)',
      [email, username, hashedPassword, fullName, role, department]
    );

    const [newUser] = await pool.query('SELECT id, email, username, name as fullName, role, department, status, createdAt as createdDate, lastLogin FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const { email, username, fullName, role, department, status, password } = req.body;
  try {
    let updateQuery = 'UPDATE users SET email=?, username=?, name=?, role=?, department=?, status=? WHERE id=?';
    let updateValues = [email, username, fullName, role, department, status, req.params.id];

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery = 'UPDATE users SET email=?, username=?, name=?, role=?, department=?, status=?, password=? WHERE id=?';
      updateValues = [email, username, fullName, role, department, status, hashedPassword, req.params.id];
    }

    await pool.query(updateQuery, updateValues);
    
    const [updatedUser] = await pool.query('SELECT id, email, username, name as fullName, role, department, status, createdAt as createdDate, lastLogin FROM users WHERE id = ?', [req.params.id]);
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
