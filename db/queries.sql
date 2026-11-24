-- In VS Code, connect to your own <NetID>_myapp database first.
-- Change these values to compare the results with the page.
DECLARE @courseId INT = NULL; -- NULL means all courses
DECLARE @startDate DATE = '2026-11-01';
DECLARE @endDate DATE = '2026-11-30';

SELECT s.session_id, c.course_code, c.course_name,
       CONVERT(CHAR(10), s.study_date, 23) AS study_date,
       s.topic, s.duration_minutes
FROM dbo.StudySessions s
JOIN dbo.Courses c ON c.course_id = s.course_id
WHERE (@courseId IS NULL OR c.course_id = @courseId)
  AND s.study_date BETWEEN @startDate AND @endDate
ORDER BY s.study_date DESC, s.session_id DESC;

-- Include courses with zero minutes so they are easy to spot.
SELECT c.course_id, c.course_code, c.course_name,
       COUNT(s.session_id) AS session_count,
       COALESCE(SUM(s.duration_minutes), 0) AS total_minutes
FROM dbo.Courses c
LEFT JOIN dbo.StudySessions s ON s.course_id = c.course_id
  AND s.study_date BETWEEN @startDate AND @endDate
WHERE (@courseId IS NULL OR c.course_id = @courseId)
GROUP BY c.course_id, c.course_code, c.course_name
ORDER BY total_minutes ASC, c.course_code;
