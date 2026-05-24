import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);

    // Users - Admin, Teachers, Students
    const users = [
      { email: 'admin@uit.edu.vn', name: 'Nguyễn Văn Admin', password: await bcrypt.hash('admin123', salt), role: 'admin' },
      
      // Teachers
      { email: 'minh.lv@uit.edu.vn', name: 'PGS. Lê Văn Minh', password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'a.nguyen@uit.edu.vn', name: 'TS. Nguyễn Văn A', password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'b.tran@uit.edu.vn', name: 'PGS. Trần Thị B', password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'c.pham@uit.edu.vn', name: 'ThS. Phạm Văn C', password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'd.hoang@uit.edu.vn', name: 'TS. Hoàng Thị D', password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      
      // Students
      { email: 'huong.tt@student.uit.edu.vn', name: 'Trần Thị Hương', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'hung.nv@student.uit.edu.vn', name: 'Nguyễn Văn Hùng', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'linh.nn@student.uit.edu.vn', name: 'Nguyễn Nữ Linh', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'minh.tt@student.uit.edu.vn', name: 'Trần Tuấn Minh', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'trang.lq@student.uit.edu.vn', name: 'Lê Quỳnh Trang', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'duc.pt@student.uit.edu.vn', name: 'Phạm Tuấn Đức', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'lan.hv@student.uit.edu.vn', name: 'Hoàng Văn Lan', password: await bcrypt.hash('123456', salt), role: 'student' },
      { email: 'hoa.ng@student.uit.edu.vn', name: 'Ngô Thị Hoa', password: await bcrypt.hash('123456', salt), role: 'student' },
    ];

    for (const u of users) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)', [u.email, u.name, u.password, u.role]);
      }
    }
    console.log('Test users seeded.');

    // Subjects
    const subjects = [
      { code: 'IT001', name: 'Lập trình căn bản', credits: 3, description: 'Giới thiệu về lập trình với Python', lecturerName: 'TS. Nguyễn Văn A', lecturerEmail: 'a.nguyen@uit.edu.vn', status: 'active' },
      { code: 'IT002', name: 'Cấu trúc dữ liệu và giải thuật', credits: 4, description: 'Học các cấu trúc dữ liệu cơ bản và thuật toán', lecturerName: 'PGS. Trần Thị B', lecturerEmail: 'b.tran@uit.edu.vn', status: 'active' },
      { code: 'IT003', name: 'Lập trình hướng đối tượng', credits: 3, description: 'OOP với Java', lecturerName: 'ThS. Phạm Văn C', lecturerEmail: 'c.pham@uit.edu.vn', status: 'active' },
      { code: 'IT004', name: 'Cơ sở dữ liệu', credits: 4, description: 'SQL và thiết kế CSDL', lecturerName: 'TS. Hoàng Thị D', lecturerEmail: 'd.hoang@uit.edu.vn', status: 'active' },
      { code: 'IT005', name: 'Phát triển ứng dụng web', credits: 3, description: 'HTML, CSS, JavaScript, ReactJS', lecturerName: 'PGS. Lê Văn Minh', lecturerEmail: 'minh.lv@uit.edu.vn', status: 'active' },
      { code: 'IT006', name: 'Hệ thống máy tính', credits: 3, description: 'Kiến trúc máy tính và hệ điều hành', lecturerName: 'TS. Nguyễn Văn A', lecturerEmail: 'a.nguyen@uit.edu.vn', status: 'active' },
      { code: 'IT007', name: 'Mạng máy tính', credits: 3, description: 'Giao thức mạng, TCP/IP', lecturerName: 'ThS. Phạm Văn C', lecturerEmail: 'c.pham@uit.edu.vn', status: 'active' },
      { code: 'IT008', name: 'An toàn thông tin', credits: 3, description: 'Mật mã, bảo mật', lecturerName: 'TS. Hoàng Thị D', lecturerEmail: 'd.hoang@uit.edu.vn', status: 'active' }
    ];

    for (const s of subjects) {
      const [existing] = await pool.query('SELECT id FROM subjects WHERE code = ?', [s.code]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO subjects (code, name, credits, description, lecturerName, lecturerEmail, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [s.code, s.name, s.credits, s.description, s.lecturerName, s.lecturerEmail, s.status]);
      }
    }
    console.log('Test subjects seeded.');

    // Semesters
    const semesters = [
      { name: 'Học kỳ 1 - 2024-2025', startDate: '2024-09-01', endDate: '2025-01-15', status: 'completed' },
      { name: 'Học kỳ 2 - 2024-2025', startDate: '2025-01-20', endDate: '2025-05-30', status: 'completed' },
      { name: 'Học kỳ 1 - 2025-2026', startDate: '2025-09-01', endDate: '2026-01-15', status: 'completed' },
      { name: 'Học kỳ 2 - 2025-2026', startDate: '2026-01-20', endDate: '2026-05-30', status: 'active' }
    ];

    for (const s of semesters) {
      const [existing] = await pool.query('SELECT id FROM semesters WHERE name = ?', [s.name]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO semesters (name, startDate, endDate, status) VALUES (?, ?, ?, ?)', 
        [s.name, s.startDate, s.endDate, s.status]);
      }
    }
    console.log('Test semesters seeded.');

    // Surveys
    const surveys = [
      { title: 'Đánh giá chất lượng giảng dạy', description: 'Khảo sát về chất lượng giảng dạy của giáo viên', type: 'internal', googleFormUrl: null, status: 'active' },
      { title: 'Đánh giá chương trình học', description: 'Khảo sát về nội dung chương trình học', type: 'internal', googleFormUrl: null, status: 'active' },
      { title: 'Đánh giá cơ sở vật chất', description: 'Khảo sát về điều kiện học tập', type: 'internal', googleFormUrl: null, status: 'active' },
      { title: 'Hài lòng với trải nghiệm học tập', description: 'Khảo sát mức độ hài lòng học sinh', type: 'internal', googleFormUrl: null, status: 'active' },
      { title: 'Đóng góp ý kiến về sinh viên', description: 'Phản hồi từ các nhân viên về sinh viên', type: 'external', googleFormUrl: null, status: 'active' }
    ];

    for (const s of surveys) {
      const [existing] = await pool.query('SELECT id FROM surveys WHERE title = ?', [s.title]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO surveys (title, description, type, googleFormUrl, status) VALUES (?, ?, ?, ?, ?)', 
        [s.title, s.description, s.type, s.googleFormUrl, s.status]);
      }
    }
    console.log('Test surveys seeded.');

    // Survey Questions
    const surveyQuestions = [
      { surveyId: 1, question: 'Giáo viên giảng dạy rõ ràng và dễ hiểu', type: 'rating' },
      { surveyId: 1, question: 'Giáo viên tương tác tốt với lớp', type: 'rating' },
      { surveyId: 1, question: 'Giáo viên chuẩn bị bài giảng tốt', type: 'rating' },
      { surveyId: 1, question: 'Ý kiến khác về giảng viên', type: 'text' },
      
      { surveyId: 2, question: 'Nội dung chương trình phù hợp với ngành học', type: 'rating' },
      { surveyId: 2, question: 'Kiến thức được cập nhật hiện đại', type: 'rating' },
      { surveyId: 2, question: 'Bài tập và dự án giúp hiểu bài', type: 'rating' },
      { surveyId: 2, question: 'Đề xuất cải thiện chương trình', type: 'text' },
      
      { surveyId: 3, question: 'Phòng học sạch sẽ và thoáng mát', type: 'rating' },
      { surveyId: 3, question: 'Thiết bị, công nghệ đầy đủ', type: 'rating' },
      { surveyId: 3, question: 'Thư viện có tài liệu cần thiết', type: 'rating' },
      
      { surveyId: 4, question: 'Hài lòng với chất lượng giáo dục', type: 'rating' },
      { surveyId: 4, question: 'Hài lòng với các hoạt động ngoại khóa', type: 'rating' },
      { surveyId: 4, question: 'Sẽ giới thiệu trường cho người khác', type: 'rating' }
    ];

    for (const q of surveyQuestions) {
      const [existing] = await pool.query('SELECT id FROM survey_questions WHERE surveyId = ? AND question = ?', [q.surveyId, q.question]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO survey_questions (surveyId, question, type) VALUES (?, ?, ?)', 
        [q.surveyId, q.question, q.type]);
      }
    }
    console.log('Test survey questions seeded.');

    // Survey Assignments
    const surveyAssignments = [
      { surveyId: 1, subjectId: 1, semesterId: 4, startDate: '2026-02-01', endDate: '2026-02-28', status: 'active' },
      { surveyId: 1, subjectId: 2, semesterId: 4, startDate: '2026-02-01', endDate: '2026-02-28', status: 'active' },
      { surveyId: 1, subjectId: 3, semesterId: 4, startDate: '2026-02-01', endDate: '2026-02-28', status: 'active' },
      { surveyId: 2, subjectId: 4, semesterId: 4, startDate: '2026-02-15', endDate: '2026-03-15', status: 'active' },
      { surveyId: 2, subjectId: 5, semesterId: 4, startDate: '2026-02-15', endDate: '2026-03-15', status: 'active' },
      { surveyId: 3, subjectId: 1, semesterId: 3, startDate: '2025-10-01', endDate: '2025-10-31', status: 'completed' }
    ];

    for (const sa of surveyAssignments) {
      const [existing] = await pool.query('SELECT id FROM survey_assignments WHERE surveyId = ? AND subjectId = ? AND semesterId = ?', 
        [sa.surveyId, sa.subjectId, sa.semesterId]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO survey_assignments (surveyId, subjectId, semesterId, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?)', 
        [sa.surveyId, sa.subjectId, sa.semesterId, sa.startDate, sa.endDate, sa.status]);
      }
    }
    console.log('Test survey assignments seeded.');

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
