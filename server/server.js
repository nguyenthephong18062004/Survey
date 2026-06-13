import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import surveyRoutes from './routes/surveys.js';
import semesterRoutes from './routes/semesters.js';
import assignmentRoutes from './routes/assignments.js';
import userRoutes from './routes/users.js';
import reportsRoutes from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Load Swagger document
const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('./swagger.json', import.meta.url))
);

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportsRoutes);

// Phục vụ giao diện Frontend (production)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.log('Khong tim thay thu muc client/dist. Server chay o che do chi API.');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
