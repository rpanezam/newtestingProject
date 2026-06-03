const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define input validation schema using Zod
const studentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  age: z.coerce.number().int().positive().max(120, 'Age must be realistic')
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse and validate request body
  const validationResult = studentSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      error: 'Invalid input data',
      details: validationResult.error.flatten().fieldErrors
    });
  }

  const { name, age } = validationResult.data;

  try {
    // Insert new student into Supabase
    const { data: insertedData, error: insertError } = await supabase
      .from('students')
      .insert([{ name, age }])
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Fetch all students to match the original API structure
    const { data: allStudents, error: fetchError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    // Safely serialize BigInt IDs for JSON response
    const serializeStudent = (student) => ({
      ...student,
      id: student.id ? student.id.toString() : null
    });

    return res.status(200).json({
      success: true,
      message: 'Student saved successfully to Supabase!',
      student: serializeStudent(insertedData[0]),
      allStudents: allStudents.map(serializeStudent)
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Failed to communicate with the database',
      details: error.message
    });
  }
};
