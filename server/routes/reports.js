import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get aggregated report for a subject
router.get('/subject/:subjectId', requireAuth, async (req, res) => {
  const subjectId = req.params.subjectId;
  
  try {
    // Check if the subject exists and get details
    const [subjects] = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
    if (subjects.length === 0) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    const subject = subjects[0];

    // Find the latest assignment for this subject
    const [assignments] = await pool.query(
      'SELECT sa.*, s.title as surveyTitle FROM survey_assignments sa JOIN surveys s ON sa.surveyId = s.id WHERE sa.subjectId = ? ORDER BY sa.id DESC LIMIT 1',
      [subjectId]
    );

    if (assignments.length === 0) {
      return res.json({ subject, surveyTitle: null, totalResponses: 0, questions: [] });
    }
    
    const assignment = assignments[0];

    // Get total completions
    const [completions] = await pool.query(
      'SELECT COUNT(id) as count FROM assignment_completions WHERE assignmentId = ?',
      [assignment.id]
    );
    const totalResponses = completions[0].count;

    // Get aggregated questions (rating average)
    const [questions] = await pool.query(`
      SELECT 
          sq.id, 
          sq.question, 
          sq.type,
          AVG(sr.ratingValue) as averageRating
      FROM survey_questions sq
      LEFT JOIN survey_responses sr ON sr.questionId = sq.id AND sr.assignmentId = ?
      WHERE sq.surveyId = ?
      GROUP BY sq.id
    `, [assignment.id, assignment.surveyId]);

    // Format the response
    const formattedQuestions = [];
    
    for (const q of questions) {
      const questionData = {
        id: q.id,
        question: q.question,
        type: q.type,
      };

      if (q.type === 'rating') {
        questionData.averageRating = q.averageRating ? parseFloat(q.averageRating).toFixed(1) : 0;
      } else if (q.type === 'text') {
        // Fetch text responses for this specific question
        const [textResponses] = await pool.query(
          'SELECT textValue FROM survey_responses WHERE questionId = ? AND assignmentId = ? AND textValue IS NOT NULL AND textValue != ""',
          [q.id, assignment.id]
        );
        questionData.comments = textResponses.map(r => r.textValue);
      }
      
      formattedQuestions.push(questionData);
    }

    // Calculate average score per submission
    const [submissionScores] = await pool.query(`
      SELECT submissionId, AVG(ratingValue) as avgScore
      FROM survey_responses
      WHERE assignmentId = ? AND ratingValue IS NOT NULL AND submissionId IS NOT NULL
      GROUP BY submissionId
    `, [assignment.id]);

    let overallAverage = 0;
    if (submissionScores.length > 0) {
      const sum = submissionScores.reduce((acc, curr) => acc + parseFloat(curr.avgScore), 0);
      overallAverage = (sum / submissionScores.length).toFixed(2);
    }

    res.json({
      subject,
      surveyTitle: assignment.surveyTitle,
      totalResponses,
      questions: formattedQuestions,
      submissionScores: submissionScores.map(s => ({
        submissionId: s.submissionId,
        score: parseFloat(s.avgScore).toFixed(2)
      })),
      overallAverage
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating report' });
  }
});

// General School Report (for academic affairs)
router.get('/school', requireAuth, async (req, res) => {
  try {
    // Get basic stats
    const [subjectCount] = await pool.query('SELECT COUNT(*) as count FROM subjects WHERE isDeleted = FALSE');
    const [studentCount] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "student"');
    const [surveyCount] = await pool.query('SELECT COUNT(*) as count FROM surveys WHERE isDeleted = FALSE');
    
    // Get average score per subject based on subject-specific survey submissions
    const [subjectAverages] = await pool.query(`
      SELECT 
        s.id, s.name, s.code, s.lecturerName,
        AVG(SubmissionAvg.avgScore) as overallRating,
        COUNT(DISTINCT ac.studentId) as totalResponses
      FROM subjects s
      JOIN survey_assignments sa ON sa.subjectId = s.id
      JOIN (
          SELECT assignmentId, submissionId, AVG(ratingValue) as avgScore
          FROM survey_responses
          WHERE ratingValue IS NOT NULL
          GROUP BY assignmentId, submissionId
      ) as SubmissionAvg ON SubmissionAvg.assignmentId = sa.id
      LEFT JOIN assignment_completions ac ON ac.assignmentId = sa.id
      WHERE s.isDeleted = FALSE
      GROUP BY s.id
      HAVING overallRating IS NOT NULL
      ORDER BY overallRating DESC
    `);

    const topSubjects = subjectAverages.slice(0, 5);

    // Get top general surveys based on average score
    const [topGeneralSurveys] = await pool.query(`
      SELECT 
        sa.surveyId,
        s.title as surveyTitle,
        COUNT(DISTINCT ac.studentId) as totalResponses,
        AVG(SubmissionAvg.avgScore) as overallRating
      FROM survey_assignments sa
      JOIN surveys s ON s.id = sa.surveyId
      JOIN (
          SELECT assignmentId, submissionId, AVG(ratingValue) as avgScore
          FROM survey_responses
          WHERE ratingValue IS NOT NULL
          GROUP BY assignmentId, submissionId
      ) as SubmissionAvg ON SubmissionAvg.assignmentId = sa.id
      LEFT JOIN assignment_completions ac ON ac.assignmentId = sa.id
      WHERE sa.subjectId IS NULL
      GROUP BY sa.surveyId
      HAVING overallRating IS NOT NULL
      ORDER BY overallRating DESC
      LIMIT 5
    `);

    // Get general survey submission scores (where subjectId is NULL)
    const [generalSubmissionScores] = await pool.query(`
      SELECT sr.submissionId, AVG(sr.ratingValue) as avgScore
      FROM survey_responses sr
      JOIN survey_assignments sa ON sr.assignmentId = sa.id
      WHERE sa.subjectId IS NULL AND sr.ratingValue IS NOT NULL AND sr.submissionId IS NOT NULL
      GROUP BY sr.submissionId
    `);

    let generalOverallAverage = 0;
    if (generalSubmissionScores.length > 0) {
      const sum = generalSubmissionScores.reduce((acc, curr) => acc + parseFloat(curr.avgScore), 0);
      generalOverallAverage = (sum / generalSubmissionScores.length).toFixed(2);
    }

    res.json({
      totalSubjects: subjectCount[0].count,
      totalStudents: studentCount[0].count,
      totalSurveys: surveyCount[0].count,
      subjectAverages: subjectAverages.map(sub => ({
        ...sub,
        overallRating: sub.overallRating ? parseFloat(sub.overallRating).toFixed(2) : 0
      })),
      topSubjects: topSubjects.map(sub => ({
        ...sub,
        overallRating: sub.overallRating ? parseFloat(sub.overallRating).toFixed(2) : 0
      })),
      topGeneralSurveys: topGeneralSurveys.map(sub => ({
        surveyId: sub.surveyId,
        surveyTitle: sub.surveyTitle,
        totalResponses: sub.totalResponses,
        overallRating: sub.overallRating ? parseFloat(sub.overallRating).toFixed(2) : 0
      })),
      generalSubmissionScores: generalSubmissionScores.map(s => ({
        submissionId: s.submissionId,
        score: parseFloat(s.avgScore).toFixed(2)
      })),
      generalOverallAverage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating school report' });
  }
});

export default router;
