-- Bạn có thể copy toàn bộ đoạn mã này và chạy trong MySQL (tab Query) của database `survey_uni`

-- 1. Bỏ chức năng Google Form: Xóa các cột liên quan trong bảng surveys
ALTER TABLE surveys DROP COLUMN googleFormUrl;
ALTER TABLE surveys DROP COLUMN type;

-- 2. Bảng lưu trữ phản hồi của sinh viên (ẨN DANH)
-- Không có cột student_id ở đây để đảm bảo tính ẩn danh hoàn toàn
CREATE TABLE IF NOT EXISTS survey_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentId INT NOT NULL, -- Liên kết với đợt khảo sát của môn học đó
    surveyId INT NOT NULL,     -- Bộ khảo sát nào
    questionId INT NOT NULL,   -- Trả lời cho câu hỏi nào
    submissionId VARCHAR(36) NOT NULL, -- UUID để nhóm các câu trả lời của cùng 1 lần nộp
    ratingValue INT,           -- Điểm đánh giá (1-5) đối với câu hỏi trắc nghiệm
    textValue TEXT,            -- Ý kiến tự luận đối với câu hỏi dạng text
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignmentId) REFERENCES survey_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (surveyId) REFERENCES surveys(id) ON DELETE CASCADE,
    FOREIGN KEY (questionId) REFERENCES survey_questions(id) ON DELETE CASCADE
);

-- 3. Bảng theo dõi tiến độ hoàn thành khảo sát
-- (Để biết sinh viên X đã làm khảo sát Y chưa, chặn làm nhiều lần, NHƯNG không liên kết được với bảng survey_responses ở trên)
CREATE TABLE IF NOT EXISTS assignment_completions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignmentId INT NOT NULL,
    studentId INT NOT NULL,
    completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignmentId) REFERENCES survey_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_completion (assignmentId, studentId)
);

-- 4. Bỏ bắt buộc môn học và học kỳ đối với Khảo sát chung
ALTER TABLE survey_assignments MODIFY subjectId INT NULL;
ALTER TABLE survey_assignments MODIFY semesterId INT NULL;
