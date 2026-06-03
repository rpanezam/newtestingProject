// A simple JavaScript helper module
function formatStudentMessage(name, age) {
  return `Student Profile: Name is ${name.toUpperCase()} and age is ${age} years old.`;
}

module.exports = {
  formatStudentMessage
};
