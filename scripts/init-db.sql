-- 教学辅助平台数据库初始化脚本

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'admin', 'school_admin')),
    school VARCHAR(100) NOT NULL,
    grade VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 课堂会话表
CREATE TABLE IF NOT EXISTS class_sessions (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    course_name VARCHAR(200),
    objectives TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER,
    status VARCHAR(20) NOT NULL CHECK (status IN ('recording', 'processing', 'completed', 'failed')),
    recording_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 课堂报告表
CREATE TABLE IF NOT EXISTS class_reports (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    teacher_id VARCHAR(36) NOT NULL,
    summary TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES class_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 指标结果表
CREATE TABLE IF NOT EXISTS metrics_results (
    id VARCHAR(36) PRIMARY KEY,
    report_id VARCHAR(36) NOT NULL,
    indicator_id VARCHAR(36) NOT NULL,
    indicator_name VARCHAR(100) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    level VARCHAR(20) CHECK (level IN ('low', 'medium', 'high')),
    interpretation TEXT,
    FOREIGN KEY (report_id) REFERENCES class_reports(id) ON DELETE CASCADE
);

-- 改进建议表
CREATE TABLE IF NOT EXISTS improvements (
    id VARCHAR(36) PRIMARY KEY,
    report_id VARCHAR(36) NOT NULL,
    area VARCHAR(100) NOT NULL,
    issue TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    priority VARCHAR(20) CHECK (priority IN ('high', 'medium', 'low')),
    FOREIGN KEY (report_id) REFERENCES class_reports(id) ON DELETE CASCADE
);

-- PPT模板表
CREATE TABLE IF NOT EXISTS ppt_templates (
    id VARCHAR(36) PRIMARY KEY,
    teacher_id VARCHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 作业集表
CREATE TABLE IF NOT EXISTS homework_sets (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36),
    teacher_id VARCHAR(36) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES class_sessions(id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(36),
    details JSONB,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 合规检查表
CREATE TABLE IF NOT EXISTS compliance_checks (
    id VARCHAR(36) PRIMARY KEY,
    check_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('passed', 'failed', 'warning')),
    details TEXT,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_sessions_teacher ON class_sessions(teacher_id);
CREATE INDEX idx_sessions_status ON class_sessions(status);
CREATE INDEX idx_sessions_created ON class_sessions(created_at DESC);
CREATE INDEX idx_reports_session ON class_reports(session_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- 插入示例数据
INSERT INTO users (id, username, email, password_hash, role, school, grade) VALUES
('1', 'teacher', 'teacher@school.com', '$2b$10$xyz...', 'teacher', '示范高中', '高一'),
('2', 'admin', 'admin@school.com', '$2b$10$xyz...', 'school_admin', '示范高中', NULL);

COMMIT;
