// Run: node db/load.js. Existing study data is preserved on repeat runs.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

async function main() {
  if (!/^[A-Za-z][A-Za-z0-9_]*_myapp$/.test(process.env.DB_NAME || '')) {
    throw new Error('DB_NAME must be your own <NetID>_myapp database.');
  }
  const pool = await sql.connect({
    server: process.env.DB_SERVER, port: Number(process.env.DB_PORT || 1433),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: { encrypt: true, trustServerCertificate: true }
  });
  try {
    await pool.request().batch(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      const existing = await new sql.Request(transaction).query('SELECT COUNT(*) AS n FROM dbo.Courses; SELECT COUNT(*) AS n FROM dbo.StudySessions;');
      if (existing.recordsets.some(rows => rows[0].n > 0)) {
        console.log('Tables already contain data; existing rows preserved.');
        await transaction.commit();
        return;
      }
      const courses = [
        ['INFO 430', 'Database Systems'], ['INFO 340', 'Client-Side Development'],
        ['INFO 360', 'Design Methods'], ['STAT 221', 'Statistical Concepts'],
        ['ENGL 131', 'Composition']
      ];
      const topics = ['Review lecture notes', 'Practice problems', 'Assignment work', 'Exam preparation', 'Reading and summary'];
      for (let i = 0; i < courses.length; i++) {
        const result = await new sql.Request(transaction)
          .input('code', sql.NVarChar(30), courses[i][0])
          .input('name', sql.NVarChar(100), courses[i][1])
          .query('INSERT INTO dbo.Courses (course_code, course_name) OUTPUT INSERTED.course_id VALUES (@code, @name)');
        for (let j = 0; j < 5; j++) {
          await new sql.Request(transaction)
            .input('courseId', sql.Int, result.recordset[0].course_id)
            .input('date', sql.Date, new Date(Date.UTC(2026, 10, 3 + j * 4 + i % 3)))
            .input('topic', sql.NVarChar(200), topics[(i + j) % topics.length])
            .input('minutes', sql.Int, 25 + ((i * 3 + j * 2) % 8) * 10)
            .query('INSERT INTO dbo.StudySessions (course_id, study_date, topic, duration_minutes) VALUES (@courseId, @date, @topic, @minutes)');
        }
      }
      await transaction.commit();
      console.log('Loaded 5 sample courses and 25 sample study sessions into ' + process.env.DB_NAME + '.');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } finally { await pool.close(); }
}
main().catch(error => { console.error('Load failed: ' + error.message); process.exitCode = 1; });
