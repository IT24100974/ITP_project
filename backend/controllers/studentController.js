import User from '../models/User.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
export const getAllStudents = async (req, res) => {
  try {
    const { search, class: className } = req.query;
    
    let query = { role: 'student' };
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by class
    if (className) {
      query.class = className;
    }
    
    const students = await User.find(query).select('-password');
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req, res) => {
  try {
    const { name, email, password, phone, address, className, photo } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !className) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    // Create student
    const student = await User.create({
      name,
      email,
      password,
      phone,
      address,
      class: className,
      photo: photo || 'https://via.placeholder.com/150',
      role: 'student'
    });

    const studentData = await User.findById(student._id).select('-password');
    res.status(201).json(studentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  try {
    const { name, email, phone, address, className, photo } = req.body;

    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if email is being changed and already exists
    if (email && email !== student.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update fields
    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.address = address || student.address;
    student.class = className || student.class;
    student.photo = photo || student.photo;

    const updatedStudent = await student.save();
    const studentData = await User.findById(updatedStudent._id).select('-password');
    
    res.json(studentData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students by class
// @route   GET /api/students/class/:className
// @access  Private/Admin
export const getStudentsByClass = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
      class: req.params.className
    }).select('-password');
    
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
