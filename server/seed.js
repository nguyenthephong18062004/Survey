import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import crypto from 'crypto';
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

    // ─── 1. USERS ────────────────────────────────────────────────────────────
    const users = [
      { email: 'admin@uit.edu.vn',               name: 'Nguyễn Văn Admin',    password: await bcrypt.hash('admin123',   salt), role: 'admin'   },
      { email: 'minh.lv@uit.edu.vn',             name: 'PGS. Lê Văn Minh',   password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'a.nguyen@uit.edu.vn',            name: 'TS. Nguyễn Văn A',   password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'b.tran@uit.edu.vn',              name: 'PGS. Trần Thị B',    password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'c.pham@uit.edu.vn',              name: 'ThS. Phạm Văn C',    password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'd.hoang@uit.edu.vn',             name: 'TS. Hoàng Thị D',    password: await bcrypt.hash('teacher123', salt), role: 'teacher' },
      { email: 'huong.tt@student.uit.edu.vn',   name: 'Trần Thị Hương',     password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'hung.nv@student.uit.edu.vn',    name: 'Nguyễn Văn Hùng',    password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'linh.nn@student.uit.edu.vn',    name: 'Nguyễn Nữ Linh',     password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'minh.tt@student.uit.edu.vn',    name: 'Trần Tuấn Minh',     password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'trang.lq@student.uit.edu.vn',   name: 'Lê Quỳnh Trang',     password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'duc.pt@student.uit.edu.vn',     name: 'Phạm Tuấn Đức',      password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'lan.hv@student.uit.edu.vn',     name: 'Hoàng Văn Lan',      password: await bcrypt.hash('123456',     salt), role: 'student' },
      { email: 'hoa.ng@student.uit.edu.vn',     name: 'Ngô Thị Hoa',        password: await bcrypt.hash('123456',     salt), role: 'student' },
    ];

    for (const u of users) {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)',
          [u.email, u.name, u.password, u.role]);
      }
    }
    console.log('✓ Users seeded.');

    // ─── 2. SUBJECTS ─────────────────────────────────────────────────────────
    const subjects = [
      { code: 'IT001', name: 'Lập trình căn bản',                credits: 3, description: 'Giới thiệu về lập trình với Python',          lecturerName: 'TS. Nguyễn Văn A',  lecturerEmail: 'a.nguyen@uit.edu.vn' },
      { code: 'IT002', name: 'Cấu trúc dữ liệu và giải thuật',  credits: 4, description: 'Học các cấu trúc dữ liệu cơ bản và thuật toán', lecturerName: 'PGS. Trần Thị B',   lecturerEmail: 'b.tran@uit.edu.vn'   },
      { code: 'IT003', name: 'Lập trình hướng đối tượng',       credits: 3, description: 'OOP với Java',                                 lecturerName: 'ThS. Phạm Văn C',   lecturerEmail: 'c.pham@uit.edu.vn'   },
      { code: 'IT004', name: 'Cơ sở dữ liệu',                   credits: 4, description: 'SQL và thiết kế CSDL',                         lecturerName: 'TS. Hoàng Thị D',   lecturerEmail: 'd.hoang@uit.edu.vn'  },
      { code: 'IT005', name: 'Phát triển ứng dụng web',         credits: 3, description: 'HTML, CSS, JavaScript, ReactJS',               lecturerName: 'PGS. Lê Văn Minh',  lecturerEmail: 'minh.lv@uit.edu.vn'  },
      { code: 'IT006', name: 'Hệ thống máy tính',               credits: 3, description: 'Kiến trúc máy tính và hệ điều hành',           lecturerName: 'TS. Nguyễn Văn A',  lecturerEmail: 'a.nguyen@uit.edu.vn' },
      { code: 'IT007', name: 'Mạng máy tính',                   credits: 3, description: 'Giao thức mạng, TCP/IP',                       lecturerName: 'ThS. Phạm Văn C',   lecturerEmail: 'c.pham@uit.edu.vn'   },
      { code: 'IT008', name: 'An toàn thông tin',                credits: 3, description: 'Mật mã, bảo mật',                             lecturerName: 'TS. Hoàng Thị D',   lecturerEmail: 'd.hoang@uit.edu.vn'  },
    ];

    for (const s of subjects) {
      const [existing] = await pool.query('SELECT id FROM subjects WHERE code = ?', [s.code]);
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO subjects (code, name, credits, description, lecturerName, lecturerEmail, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [s.code, s.name, s.credits, s.description, s.lecturerName, s.lecturerEmail, 'active']);
      }
    }
    console.log('✓ Subjects seeded.');

    // ─── 3. SEMESTERS ────────────────────────────────────────────────────────
    const semesters = [
      { name: 'Học kỳ 1 - 2024-2025', startDate: '2024-09-01', endDate: '2025-01-15', status: 'completed' },
      { name: 'Học kỳ 2 - 2024-2025', startDate: '2025-01-20', endDate: '2025-05-30', status: 'completed' },
      { name: 'Học kỳ 1 - 2025-2026', startDate: '2025-09-01', endDate: '2026-01-15', status: 'completed' },
      { name: 'Học kỳ 2 - 2025-2026', startDate: '2026-01-20', endDate: '2026-05-30', status: 'active'    },
    ];

    for (const s of semesters) {
      const [existing] = await pool.query('SELECT id FROM semesters WHERE name = ?', [s.name]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO semesters (name, startDate, endDate, status) VALUES (?, ?, ?, ?)',
          [s.name, s.startDate, s.endDate, s.status]);
      }
    }
    console.log('✓ Semesters seeded.');

    // ─── 4. SURVEYS (không dùng type / googleFormUrl) ─────────────────────────
    const surveys = [
      { title: 'Đánh giá chất lượng giảng dạy',      description: 'Khảo sát về chất lượng giảng dạy của giáo viên' },
      { title: 'Đánh giá chương trình học',            description: 'Khảo sát về nội dung chương trình học'          },
      { title: 'Đánh giá cơ sở vật chất',             description: 'Khảo sát về điều kiện học tập'                  },
      { title: 'Hài lòng với trải nghiệm học tập',   description: 'Khảo sát mức độ hài lòng tổng thể sinh viên'    },
    ];

    for (const s of surveys) {
      const [existing] = await pool.query('SELECT id FROM surveys WHERE title = ?', [s.title]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO surveys (title, description, status) VALUES (?, ?, ?)',
          [s.title, s.description, 'active']);
      }
    }
    console.log('✓ Surveys seeded.');

    // ─── 5. SURVEY QUESTIONS ─────────────────────────────────────────────────
    // Lấy IDs thực của surveys vừa tạo
    const [surveyRows] = await pool.query('SELECT id, title FROM surveys ORDER BY id');
    const surveyMap = {};
    for (const r of surveyRows) surveyMap[r.title] = r.id;

    const questions = [
      // Khảo sát 1 - Chất lượng giảng dạy
      { title: 'Đánh giá chất lượng giảng dạy',     question: 'Giáo viên giảng dạy rõ ràng và dễ hiểu',           type: 'rating' },
      { title: 'Đánh giá chất lượng giảng dạy',     question: 'Giáo viên tương tác tốt với sinh viên',             type: 'rating' },
      { title: 'Đánh giá chất lượng giảng dạy',     question: 'Giáo viên chuẩn bị bài giảng đầy đủ',              type: 'rating' },
      { title: 'Đánh giá chất lượng giảng dạy',     question: 'Giáo viên hỗ trợ sinh viên ngoài giờ học',         type: 'rating' },
      { title: 'Đánh giá chất lượng giảng dạy',     question: 'Ý kiến khác về giảng viên',                        type: 'text'   },
      // Khảo sát 2 - Chương trình học
      { title: 'Đánh giá chương trình học',          question: 'Nội dung chương trình phù hợp với ngành học',       type: 'rating' },
      { title: 'Đánh giá chương trình học',          question: 'Kiến thức được cập nhật, hiện đại',                 type: 'rating' },
      { title: 'Đánh giá chương trình học',          question: 'Bài tập và dự án giúp hiểu sâu kiến thức',          type: 'rating' },
      { title: 'Đánh giá chương trình học',          question: 'Đề xuất cải thiện chương trình học',               type: 'text'   },
      // Khảo sát 3 - Cơ sở vật chất
      { title: 'Đánh giá cơ sở vật chất',            question: 'Phòng học sạch sẽ và thoáng mát',                   type: 'rating' },
      { title: 'Đánh giá cơ sở vật chất',            question: 'Thiết bị và công nghệ đầy đủ, hiện đại',            type: 'rating' },
      { title: 'Đánh giá cơ sở vật chất',            question: 'Thư viện có tài liệu học tập phong phú',            type: 'rating' },
      // Khảo sát 4 - Hài lòng tổng thể (Khảo sát chung)
      { title: 'Hài lòng với trải nghiệm học tập',  question: 'Hài lòng với chất lượng giáo dục chung',            type: 'rating' },
      { title: 'Hài lòng với trải nghiệm học tập',  question: 'Hài lòng với các hoạt động ngoại khoá',             type: 'rating' },
      { title: 'Hài lòng với trải nghiệm học tập',  question: 'Sẽ giới thiệu trường cho người khác',               type: 'rating' },
      { title: 'Hài lòng với trải nghiệm học tập',  question: 'Điều bạn thích nhất ở trường',                      type: 'text'   },
    ];

    for (const q of questions) {
      const sId = surveyMap[q.title];
      if (!sId) continue;
      const [existing] = await pool.query('SELECT id FROM survey_questions WHERE surveyId = ? AND question = ?', [sId, q.question]);
      if (existing.length === 0) {
        await pool.query('INSERT INTO survey_questions (surveyId, question, type) VALUES (?, ?, ?)', [sId, q.question, q.type]);
      }
    }
    console.log('✓ Survey questions seeded.');

    // ─── 6. SURVEY ASSIGNMENTS ───────────────────────────────────────────────
    // Khảo sát 1 & 2 gán cho môn học; Khảo sát 4 gán chung toàn trường (subjectId NULL)
    const [subjectRows] = await pool.query('SELECT id, code FROM subjects ORDER BY id');
    const subjectMap = {};
    for (const r of subjectRows) subjectMap[r.code] = r.id;

    const [semesterRows] = await pool.query('SELECT id, name FROM semesters ORDER BY id');
    const semesterMap = {};
    for (const r of semesterRows) semesterMap[r.name] = r.id;

    const s1 = surveyMap['Đánh giá chất lượng giảng dạy'];
    const s2 = surveyMap['Đánh giá chương trình học'];
    const s3 = surveyMap['Đánh giá cơ sở vật chất'];
    const s4 = surveyMap['Hài lòng với trải nghiệm học tập'];
    const sem4 = semesterMap['Học kỳ 2 - 2025-2026'];
    const sem3 = semesterMap['Học kỳ 1 - 2025-2026'];

    const assignments = [
      { surveyId: s1, subjectId: subjectMap['IT001'], semesterId: sem4, startDate: '2026-02-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s1, subjectId: subjectMap['IT002'], semesterId: sem4, startDate: '2026-02-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s1, subjectId: subjectMap['IT003'], semesterId: sem4, startDate: '2026-02-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s1, subjectId: subjectMap['IT004'], semesterId: sem4, startDate: '2026-02-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s1, subjectId: subjectMap['IT005'], semesterId: sem4, startDate: '2026-02-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s2, subjectId: subjectMap['IT006'], semesterId: sem3, startDate: '2025-10-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s2, subjectId: subjectMap['IT007'], semesterId: sem3, startDate: '2025-10-01', endDate: '2026-12-31', status: 'active' },
      { surveyId: s3, subjectId: subjectMap['IT008'], semesterId: sem3, startDate: '2025-10-01', endDate: '2026-12-31', status: 'active' },
      // Khảo sát chung - không thuộc môn học nào
      { surveyId: s4, subjectId: null, semesterId: null, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active' },
    ];

    const assignmentIds = {};
    for (const sa of assignments) {
      let existing;
      if (sa.subjectId) {
        [existing] = await pool.query('SELECT id FROM survey_assignments WHERE surveyId = ? AND subjectId = ?', [sa.surveyId, sa.subjectId]);
      } else {
        [existing] = await pool.query('SELECT id FROM survey_assignments WHERE surveyId = ? AND subjectId IS NULL', [sa.surveyId]);
      }
      if (existing.length === 0) {
        const [result] = await pool.query(
          'INSERT INTO survey_assignments (surveyId, subjectId, semesterId, startDate, endDate, status) VALUES (?, ?, ?, ?, ?, ?)',
          [sa.surveyId, sa.subjectId, sa.semesterId, sa.startDate, sa.endDate, sa.status]);
        const key = sa.subjectId ? `${sa.surveyId}_${sa.subjectId}` : `${sa.surveyId}_general`;
        assignmentIds[key] = result.insertId;
      } else {
        const key = sa.subjectId ? `${sa.surveyId}_${sa.subjectId}` : `${sa.surveyId}_general`;
        assignmentIds[key] = existing[0].id;
      }
    }
    console.log('✓ Survey assignments seeded.');

    // ─── 7. SURVEY RESPONSES (dữ liệu mẫu) ──────────────────────────────────
    // Lấy IDs câu hỏi theo từng khảo sát
    const [qRows] = await pool.query('SELECT id, surveyId, type FROM survey_questions ORDER BY id');
    const questionsBySurvey = {};
    for (const q of qRows) {
      if (!questionsBySurvey[q.surveyId]) questionsBySurvey[q.surveyId] = [];
      questionsBySurvey[q.surveyId].push(q);
    }

    // Hàm tạo ngẫu nhiên điểm trong khoảng [min, max]
    const randRating = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const sampleComments = [
      'Giảng viên rất nhiệt tình và dễ hiểu.',
      'Chương trình học phù hợp và thực tế.',
      'Cần thêm bài tập thực hành.',
      'Rất hài lòng với cách giảng dạy.',
      'Tài liệu cần được cập nhật thêm.',
      'Thầy/Cô giải thích rất rõ ràng.',
      'Môn học bổ ích và thú vị.',
    ];

    // Tạo responses cho mỗi assignment thuộc môn học (7 sinh viên mẫu, mỗi sv 1 lần nộp)
    const studentIds = (await pool.query('SELECT id FROM users WHERE role = "student"'))[0].map(r => r.id);

    const responseSubjectAssignments = [
      { key: `${s1}_${subjectMap['IT001']}`, surveyId: s1 },
      { key: `${s1}_${subjectMap['IT002']}`, surveyId: s1 },
      { key: `${s1}_${subjectMap['IT003']}`, surveyId: s1 },
      { key: `${s1}_${subjectMap['IT004']}`, surveyId: s1 },
      { key: `${s1}_${subjectMap['IT005']}`, surveyId: s1 },
      { key: `${s2}_${subjectMap['IT006']}`, surveyId: s2 },
      { key: `${s2}_${subjectMap['IT007']}`, surveyId: s2 },
      { key: `${s3}_${subjectMap['IT008']}`, surveyId: s3 },
    ];

    let responsesInserted = 0;

    for (const asgn of responseSubjectAssignments) {
      const assignmentId = assignmentIds[asgn.key];
      if (!assignmentId) continue;
      const qs = (questionsBySurvey[asgn.surveyId] || []);
      if (qs.length === 0) continue;

      for (const studentId of studentIds) {
        // Kiểm tra đã hoàn thành chưa
        const [done] = await pool.query('SELECT id FROM assignment_completions WHERE assignmentId = ? AND studentId = ?', [assignmentId, studentId]);
        if (done.length > 0) continue;

        const submissionId = crypto.randomUUID();
        for (const q of qs) {
          const rating = q.type === 'rating' ? randRating(3, 5) : null;
          const text   = q.type === 'text'   ? sampleComments[Math.floor(Math.random() * sampleComments.length)] : null;
          await pool.query(
            'INSERT INTO survey_responses (assignmentId, surveyId, questionId, ratingValue, textValue, submissionId) VALUES (?, ?, ?, ?, ?, ?)',
            [assignmentId, asgn.surveyId, q.id, rating, text, submissionId]);
          responsesInserted++;
        }

        // Đánh dấu hoàn thành
        await pool.query('INSERT IGNORE INTO assignment_completions (assignmentId, studentId) VALUES (?, ?)', [assignmentId, studentId]);
      }
    }

    // Responses cho Khảo sát chung (không thuộc môn học)
    const generalAssignmentId = assignmentIds[`${s4}_general`];
    if (generalAssignmentId) {
      const qs = (questionsBySurvey[s4] || []);
      for (const studentId of studentIds) {
        const [done] = await pool.query('SELECT id FROM assignment_completions WHERE assignmentId = ? AND studentId = ?', [generalAssignmentId, studentId]);
        if (done.length > 0) continue;
        const submissionId = crypto.randomUUID();
        for (const q of qs) {
          const rating = q.type === 'rating' ? randRating(3, 5) : null;
          const text   = q.type === 'text'   ? sampleComments[Math.floor(Math.random() * sampleComments.length)] : null;
          await pool.query(
            'INSERT INTO survey_responses (assignmentId, surveyId, questionId, ratingValue, textValue, submissionId) VALUES (?, ?, ?, ?, ?, ?)',
            [generalAssignmentId, s4, q.id, rating, text, submissionId]);
          responsesInserted++;
        }
        await pool.query('INSERT IGNORE INTO assignment_completions (assignmentId, studentId) VALUES (?, ?)', [generalAssignmentId, studentId]);
      }
    }

    console.log(`✓ Survey responses seeded (${responsesInserted} records).`);
    console.log('\n🎉 Seeding hoàn tất!');
    console.log('   Admin   : admin@uit.edu.vn / admin123');
    console.log('   Teacher : a.nguyen@uit.edu.vn / teacher123');
    console.log('   Student : huong.tt@student.uit.edu.vn / 123456');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
