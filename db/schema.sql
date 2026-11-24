IF OBJECT_ID('dbo.Courses', 'U') IS NULL
CREATE TABLE dbo.Courses (
  course_id INT IDENTITY PRIMARY KEY,
  course_code NVARCHAR(30) NOT NULL UNIQUE,
  course_name NVARCHAR(100) NOT NULL
);

IF OBJECT_ID('dbo.StudySessions', 'U') IS NULL
CREATE TABLE dbo.StudySessions (
  session_id INT IDENTITY PRIMARY KEY,
  course_id INT NOT NULL REFERENCES dbo.Courses(course_id),
  study_date DATE NOT NULL,
  topic NVARCHAR(200) NOT NULL,
  duration_minutes INT NOT NULL CHECK (duration_minutes BETWEEN 1 AND 1440)
);
