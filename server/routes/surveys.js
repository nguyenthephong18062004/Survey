import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Get all active surveys
router.get('/', async (req, res) => {
  try {
    const [surveys] = await pool.query('SELECT * FROM surveys WHERE isDeleted = FALSE');
    
    // Fetch questions for each survey
    for (let survey of surveys) {
      const [questions] = await pool.query('SELECT * FROM survey_questions WHERE surveyId = ?', [survey.id]);
      survey.questions = questions;
    }
    
    res.json(surveys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a survey
router.post('/', async (req, res) => {
  const { title, description, status, questions } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [result] = await connection.query(
      'INSERT INTO surveys (title, description, status) VALUES (?, ?, ?)',
      [title, description || '', status || 'active']
    );
    
    const surveyId = result.insertId;
    
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await connection.query(
          'INSERT INTO survey_questions (surveyId, question, type) VALUES (?, ?, ?)',
          [surveyId, q.question, q.type || 'rating']
        );
      }
    }
    
    await connection.commit();
    
    // Fetch newly created survey
    const [newSurvey] = await connection.query('SELECT * FROM surveys WHERE id = ?', [surveyId]);
    const [newQuestions] = await connection.query('SELECT * FROM survey_questions WHERE surveyId = ?', [surveyId]);
    
    const survey = newSurvey[0];
    survey.questions = newQuestions;
    
    res.status(201).json(survey);
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Update a survey
router.put('/:id', async (req, res) => {
  const { title, description, status, questions } = req.body;
  const surveyId = req.params.id;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.query(
      'UPDATE surveys SET title=?, description=?, status=? WHERE id=?',
      [title, description, status, surveyId]
    );
    
    // Simplest way to handle questions update: delete existing and insert new ones
    if (questions) {
      await connection.query('DELETE FROM survey_questions WHERE surveyId = ?', [surveyId]);
      for (const q of questions) {
        await connection.query(
          'INSERT INTO survey_questions (surveyId, question, type) VALUES (?, ?, ?)',
          [surveyId, q.question, q.type || 'rating']
        );
      }
    }
    
    await connection.commit();
    
    const [updatedSurvey] = await connection.query('SELECT * FROM surveys WHERE id = ?', [surveyId]);
    if (updatedSurvey.length === 0) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    const [updatedQuestions] = await connection.query('SELECT * FROM survey_questions WHERE surveyId = ?', [surveyId]);
    const survey = updatedSurvey[0];
    survey.questions = updatedQuestions;
    
    res.json(survey);
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Delete a survey (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('UPDATE surveys SET isDeleted = TRUE WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    res.json({ message: 'Survey deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a survey response
router.post('/:assignmentId/submit', requireAuth, async (req, res) => {
  const assignmentId = req.params.assignmentId;
  const studentId = req.user.id;
  const { responses } = req.body; // Array of { questionId, ratingValue, textValue }
  
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // 1. Check if the assignment is active
    const [assignments] = await connection.query(
      'SELECT surveyId FROM survey_assignments WHERE id = ? AND status = "active"',
      [assignmentId]
    );
    
    if (assignments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Assignment not found or not active' });
    }
    
    const surveyId = assignments[0].surveyId;
    
    // 2. Check if student already completed this assignment
    const [completions] = await connection.query(
      'SELECT id FROM assignment_completions WHERE assignmentId = ? AND studentId = ?',
      [assignmentId, studentId]
    );
    
    if (completions.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'You have already submitted this survey' });
    }
    
    // 3. Insert anonymous responses
    if (responses && responses.length > 0) {
      const submissionId = crypto.randomUUID();
      for (const response of responses) {
        try {
          await connection.query(
            'INSERT INTO survey_responses (assignmentId, surveyId, questionId, ratingValue, textValue, submissionId) VALUES (?, ?, ?, ?, ?, ?)',
            [assignmentId, surveyId, response.questionId, response.ratingValue || null, response.textValue || null, submissionId]
          );
        } catch (insertError) {
          // Fallback: try without submissionId in case column doesn't exist yet
          console.warn('submissionId insert failed, trying without it:', insertError.message);
          await connection.query(
            'INSERT INTO survey_responses (assignmentId, surveyId, questionId, ratingValue, textValue) VALUES (?, ?, ?, ?, ?)',
            [assignmentId, surveyId, response.questionId, response.ratingValue || null, response.textValue || null]
          );
        }
      }
    }
    
    // 4. Mark assignment as completed for this student
    await connection.query(
      'INSERT INTO assignment_completions (assignmentId, studentId) VALUES (?, ?)',
      [assignmentId, studentId]
    );
    
    await connection.commit();
    res.json({ message: 'Survey submitted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error during submission' });
  } finally {
    connection.release();
  }
});

export default router;
