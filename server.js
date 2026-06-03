const express = require('express');
const path = require('path');
const saveStudentHandler = require('./api/user/save-student');
const greetHandler = require('./api/user/greet');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Expose API endpoints
app.post('/api/user/save-student', saveStudentHandler);
app.get('/api/user/greet', greetHandler);

// Serve the main frontend page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Main Portal is running and listening on port ${port}`);
});
