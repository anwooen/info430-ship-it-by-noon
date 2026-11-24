require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const sql = require('mssql');
const app = express();
const queryFile = fs.readFileSync(path.join(__dirname, '../db/queries.sql'), 'utf8');
// Use the same queries as the student's SQL worksheet, with API parameters.
const studyQuery = queryFile.slice(queryFile.indexOf('SELECT s.session_id'));
let poolPromise;
function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect({
      server: process.env.DB_SERVER, port: Number(process.env.DB_PORT || 1433),
      user: process.env.DB_USER, password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: { encrypt: true, trustServerCertificate: true }
    }).catch(error => { poolPromise = null; throw error; });
  }
  return poolPromise;
}
app.use(express.static(path.join(__dirname, '../web')));
app.get('/api/courses', async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT course_id, course_code, course_name FROM dbo.Courses ORDER BY course_code');
    res.json(result.recordset);
  } catch (error) { next(error); }
});
function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
    && value >= '0001-01-01';
}
app.get('/api/study-sessions', async (req, res, next) => {
  const { courseId = '', startDate, endDate } = req.query;
  if (typeof courseId !== 'string' || (courseId !== '' && (!/^[1-9]\d*$/.test(courseId) || Number(courseId) > 2147483647))
      || !validDate(startDate) || !validDate(endDate) || startDate > endDate) {
    return res.status(400).json({ error: 'Choose a valid course and date range. The start date must come first.' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('courseId', sql.Int, courseId === '' ? null : Number(courseId))
      .input('startDate', sql.Date, new Date(startDate))
      .input('endDate', sql.Date, new Date(endDate))
      .query(studyQuery);
    res.json({ sessions: result.recordsets[0], courses: result.recordsets[1] });
  } catch (error) { next(error); }
});
app.use((error, req, res, next) => {
  console.error('Database request failed: ' + error.message);
  res.status(500).json({ error: 'Could not load study data. Check your UW Wi-Fi or VPN connection and try again.' });
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Study Session Tracker: http://localhost:${port}`));
