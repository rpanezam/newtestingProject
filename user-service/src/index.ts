import dotenv from 'dotenv';
// Importing the JavaScript helper module directly into TypeScript
// @ts-ignore
import { formatStudentMessage } from './helper';
import { PrismaClient } from '@prisma/client';
import http from 'http';

dotenv.config();

const prisma = new PrismaClient();

interface Student {
  name: string;
  age: number;
}

const newStudent: Student = {
  name: "Sajib Dhaka",
  age: 25
};

async function runDatabaseOperations() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]')) {
    return { notice: "Prisma is not fully configured yet. Please update the DATABASE_URL in the .env file with your valid database password." };
  }

  try {
    const createdStudent = await prisma.student.create({
      data: {
        name: newStudent.name,
        age: newStudent.age,
      },
    });

    const serializeStudent = (s: any) => ({
      ...s,
      id: s.id.toString(),
    });

    const allStudents = await prisma.student.findMany();

    return {
      success: true,
      inserted: serializeStudent(createdStudent),
      all: allStudents.map(serializeStudent)
    };

  } catch (error: any) {
    throw new Error(error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

// Create HTTP Web Server
const server = http.createServer(async (req, res) => {
  if (req.url === '/' || req.url === '/health') {
    try {
      const dbResult = await runDatabaseOperations();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: "Hello from User Service!",
        formattedMessage: formatStudentMessage(newStudent.name, newStudent.age),
        databaseOperations: dbResult
      }));
    } catch (err: any) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

// Port should be read from the environment variable (GCP sets this automatically)
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`User Service is running and listening on port ${port}`);
});
