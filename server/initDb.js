import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbName = process.env.DB_NAME;

async function initDb() {
  let connection;
  try {
    // Connect to MySQL server without selecting a DB first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Connected to MySQL server.');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' created or already exists.`);

    // Switch to the database
    await connection.query(`USE \`${dbName}\``);

    // Create tables
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin', 'teacher', 'student') DEFAULT 'student',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createSubjectsTable = `
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        credits INT NOT NULL DEFAULT 0,
        description TEXT,
        lecturerName VARCHAR(255),
        lecturerEmail VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        isDeleted BOOLEAN DEFAULT FALSE
      )
    `;

    const createSurveysTable = `
      CREATE TABLE IF NOT EXISTS surveys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('internal', 'external') DEFAULT 'internal',
        googleFormUrl VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        isDeleted BOOLEAN DEFAULT FALSE
      )
    `;

    const createSurveyQuestionsTable = `
      CREATE TABLE IF NOT EXISTS survey_questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        surveyId INT NOT NULL,
        question TEXT NOT NULL,
        type ENUM('rating', 'text') DEFAULT 'rating',
        FOREIGN KEY (surveyId) REFERENCES surveys(id) ON DELETE CASCADE
      )
    `;

    const createSemestersTable = `
      CREATE TABLE IF NOT EXISTS semesters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming'
      )
    `;

    const createSurveyAssignmentsTable = `
      CREATE TABLE IF NOT EXISTS survey_assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        surveyId INT NOT NULL,
        subjectId INT,
        semesterId INT,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        status ENUM('active', 'completed', 'expired') DEFAULT 'active',
        FOREIGN KEY (surveyId) REFERENCES surveys(id) ON DELETE CASCADE,
        FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE,
        FOREIGN KEY (semesterId) REFERENCES semesters(id) ON DELETE SET NULL
      )
    `;

    await connection.query(createUsersTable);
    await connection.query(createSubjectsTable);
    await connection.query(createSurveysTable);
    await connection.query(createSurveyQuestionsTable);
    await connection.query(createSemestersTable);
    await connection.query(createSurveyAssignmentsTable);

    console.log('All tables created successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

initDb();
