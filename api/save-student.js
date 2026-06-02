const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required' });
  }

  try {
    const filePath = path.join(process.cwd(), 'database', 'student.json');
    
    // Read current data
    let fileData = [];
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      fileData = JSON.parse(content || '[]');
    }

    // Append new student
    const newStudent = { name, age: parseInt(age, 10) };
    fileData.push(newStudent);

    // Save back to file
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');

    return res.status(200).json({
      success: true,
      message: 'Student saved successfully!',
      student: newStudent,
      allStudents: fileData
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to write database file', details: error.message });
  }
};
