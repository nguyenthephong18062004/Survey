import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get assignments for the logged-in student (Pending only)
router.get('/student/me', requireAuth, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // We fetch assignments that are active and not completed by the student
    const query = `
      SELECT 
        sa.id as assignmentId,
        sa.startDate,
        sa.endDate,
        sub.id as subjectId,
        sub.code as subjectCode,
        sub.name as subjectName,
        sub.lecturerName,
        s.id as surveyId,
        s.title as surveyTitle,
        IF(ac.id IS NOT NULL, true, false) as isCompleted
      FROM survey_assignments sa
      LEFT JOIN subjects sub ON sa.subjectId = sub.id
      JOIN surveys s ON sa.surveyId = s.id
      LEFT JOIN assignment_completions ac ON sa.id = ac.assignmentId AND ac.studentId = ?
      WHERE sa.status = 'active'
        AND (sub.isDeleted = FALSE OR sub.id IS NULL)
        AND s.isDeleted = FALSE
    `;
    
    const [assignments] = await pool.query(query, [studentId]);
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM survey_assignments');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create an assignment
router.post('/', async (req, res) => {
  const { surveyId, subjectId, semesterId, startDate, endDate, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO survey_assignments (surveyId, subjectId, semesterId, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?)',
      [surveyId, subjectId || null, semesterId || null, startDate, endDate, status || 'active']
    );
    
    const [newAssignment] = await pool.query('SELECT * FROM survey_assignments WHERE id = ?', [result.insertId]);
    res.status(201).json(newAssignment[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an assignment
router.put('/:id', async (req, res) => {
  const { surveyId, subjectId, semesterId, startDate, endDate, status } = req.body;
  try {
    await pool.query(
      'UPDATE survey_assignments SET surveyId=?, subjectId=?, semesterId=?, startDate=?, endDate=?, status=? WHERE id=?',
      [surveyId, subjectId, semesterId, startDate, endDate, status, req.params.id]
    );
    
    const [updatedAssignment] = await pool.query('SELECT * FROM survey_assignments WHERE id = ?', [req.params.id]);
    if (updatedAssignment.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(updatedAssignment[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an assignment
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM survey_assignments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
