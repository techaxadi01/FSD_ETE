require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); // DNS fix for MongoDB SRV lookups

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'campus_innovation_hub_secret_key_2026';

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected: Campus Idea & Innovation Hub'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- CONSTANTS ---
const VALID_DOMAINS = [
  'Smart Campus & IoT',
  'Sustainability & Green Campus',
  'Academic & EdTech',
  'Healthcare & Well-being',
  'Campus Safety & Security',
  'Fintech & Student Economy',
  'AI & Automation',
  'Community & Social Impact',
  'Other'
];

const VALID_STATUSES = ['Review', 'Approved', 'Prototype', 'Implemented'];
const VALID_IMPACTS = ['Low', 'Medium', 'High', 'Transformative'];

// --- SCHEMAS & MODELS ---

// User Schema (with unique username & unique email)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [2, 'Username must be at least 2 characters'],
    match: [/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, underscores, dots, or hyphens']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [3, 'Password must be at least 3 characters']
  },
  department: {
    type: String,
    default: 'Computer Science & Engineering'
  },
  role: {
    type: String,
    enum: ['Student', 'Faculty', 'Innovator', 'Admin'],
    default: 'Student'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  authorRole: { type: String, default: 'Student' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Idea Schema
const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Idea title is required'],
    trim: true,
    minlength: [3, 'Idea title must be at least 3 characters long'],
    maxlength: [150, 'Idea title cannot exceed 150 characters']
  },
  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required'],
    trim: true,
    minlength: [10, 'Problem statement must be at least 10 characters long']
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: {
      values: VALID_DOMAINS,
      message: 'Please select a valid domain from the provided options'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long describing the proposed innovation']
  },
  technologies: {
    type: [String],
    required: [true, 'At least one technology is required'],
    validate: {
      validator: function(val) {
        return Array.isArray(val) && val.length > 0 && val.some(t => t.trim().length > 0);
      },
      message: 'At least one technology must be specified for implementation'
    }
  },
  expectedImpact: {
    type: String,
    required: [true, 'Expected impact is required'],
    enum: {
      values: VALID_IMPACTS,
      message: 'Expected impact must be Low, Medium, High, or Transformative'
    }
  },
  status: {
    type: String,
    enum: {
      values: VALID_STATUSES,
      message: 'Status must follow workflow: Review -> Approved -> Prototype -> Implemented'
    },
    default: 'Review'
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  },
  votedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    username: { type: String },
    email: { type: String }
  },
  comments: [commentSchema]
}, { timestamps: true });

const Idea = mongoose.model('Idea', ideaSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err && user) {
        req.user = user;
      }
      next();
    });
  } else {
    next();
  }
};

// --- AUTH ROUTES (WITH UNIQUE USERNAME & EMAIL + EITHER LOGIN) ---

// 1. Register User (Validates unique username and unique email)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, username, email, password, department, role } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters long.' });
    }

    if (!username || username.trim().length < 2) {
      return res.status(400).json({ error: 'Username is required and must be at least 2 characters.' });
    }

    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, underscores, dots, or hyphens.' });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    if (!password || password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return res.status(400).json({ error: 'An account with this username already exists. Please choose another username.' });
    }

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      department: department || 'Computer Science & Engineering',
      role: role || 'Student'
    });

    const token = jwt.sign(
      { id: newUser._id, name: newUser.name, username: newUser.username, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        department: newUser.department,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login User (Supports either Username OR Email)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginIdentifier = (identifier || email || username || '').toLowerCase().trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    // Search by either username or email
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier },
        { username: loginIdentifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username/email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username/email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        department: user.department,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Current User
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- IDEA REST API ROUTES (CRUD, SEARCH, FILTER, SORT, VOTE) ---

// 1. READ ALL (Search by Title / Problem Statement / Technology, Filter by Domain & Status, Sort)
app.get('/api/ideas', optionalAuth, async (req, res) => {
  try {
    const { search, domain, status, sort } = req.query;
    let query = {};

    // Search include: idea title, problem statement, or technology
    if (search && search.trim()) {
      const sanitized = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = { $regex: sanitized, $options: 'i' };
      query.$or = [
        { title: regex },
        { problemStatement: regex },
        { description: regex },
        { technologies: regex }
      ];
    }

    // Filter by Domain
    if (domain && domain !== 'All' && domain.trim()) {
      query.domain = domain.trim();
    }

    // Filter by Status (Workflow: Review, Approved, Prototype, Implemented)
    if (status && status !== 'All' && status.trim()) {
      query.status = status.trim();
    }

    let cursor = Idea.find(query);

    // Sorting: newest, oldest, votes
    switch (sort) {
      case 'oldest':
        cursor = cursor.sort({ createdAt: 1 });
        break;
      case 'votes':
        cursor = cursor.sort({ votes: -1, createdAt: -1 });
        break;
      case 'newest':
      default:
        cursor = cursor.sort({ createdAt: -1 });
        break;
    }

    const rawIdeas = await cursor;

    // Attach hasVoted boolean if user is authenticated
    const currentUserId = req.user ? req.user.id : null;
    const ideas = rawIdeas.map(idea => {
      const ideaObj = idea.toObject();
      ideaObj.hasVoted = currentUserId 
        ? idea.votedBy.some(id => id.toString() === currentUserId.toString())
        : false;
      return ideaObj;
    });

    res.json(ideas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. READ SINGLE IDEA
app.get('/api/ideas/:id', optionalAuth, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Innovation idea not found' });
    }
    const currentUserId = req.user ? req.user.id : null;
    const ideaObj = idea.toObject();
    ideaObj.hasVoted = currentUserId
      ? idea.votedBy.some(id => id.toString() === currentUserId.toString())
      : false;

    res.json(ideaObj);
  } catch (err) {
    res.status(400).json({ error: 'Invalid idea ID' });
  }
});

// 3. CREATE IDEA (Server Validations for Required Fields, Min Description Length, Valid Domain, Technologies, Expected Impact)
app.post('/api/ideas', optionalAuth, async (req, res) => {
  try {
    const {
      title,
      problemStatement,
      domain,
      description,
      technologies,
      expectedImpact,
      status,
      authorName
    } = req.body;

    // Server-Side Validations
    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: 'Idea title is required and must be at least 3 characters long.' });
    }
    if (!problemStatement || problemStatement.trim().length < 10) {
      return res.status(400).json({ error: 'Problem statement is required and must be at least 10 characters long.' });
    }
    if (!domain || !VALID_DOMAINS.includes(domain)) {
      return res.status(400).json({ error: `Valid domain is required. Options: ${VALID_DOMAINS.join(', ')}` });
    }
    if (!description || description.trim().length < 20) {
      return res.status(400).json({ error: 'Description is required and must be at least 20 characters long describing the proposed methodology.' });
    }

    // Process and validate technologies
    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof technologies === 'string') {
      techArray = technologies.split(',').map(t => t.trim()).filter(Boolean);
    }

    if (techArray.length === 0) {
      return res.status(400).json({ error: 'At least one technology must be specified for the innovation.' });
    }

    if (!expectedImpact || !VALID_IMPACTS.includes(expectedImpact)) {
      return res.status(400).json({ error: `Expected impact is required. Options: ${VALID_IMPACTS.join(', ')}` });
    }

    const author = {
      userId: req.user ? req.user.id : null,
      name: (req.user ? req.user.name : authorName) || 'Student Innovator',
      username: req.user ? req.user.username : 'innovator',
      email: req.user ? req.user.email : 'student@campus.edu'
    };

    const newIdea = await Idea.create({
      title: title.trim(),
      problemStatement: problemStatement.trim(),
      domain,
      description: description.trim(),
      technologies: techArray,
      expectedImpact,
      status: status && VALID_STATUSES.includes(status) ? status : 'Review',
      author
    });

    res.status(201).json(newIdea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. UPDATE IDEA (Owner only)
app.put('/api/ideas/:id', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body };
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const ownerId = idea.author?.userId ? String(idea.author.userId) : '';
    if (!ownerId || ownerId !== req.user.id.toString()) {
      return res.status(403).json({ error: 'You can only edit your own project.' });
    }

    if (data.technologies) {
      if (Array.isArray(data.technologies)) {
        data.technologies = data.technologies.map(t => String(t).trim()).filter(Boolean);
      } else if (typeof data.technologies === 'string') {
        data.technologies = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
      if (data.technologies.length === 0) {
        return res.status(400).json({ error: 'At least one technology must be specified.' });
      }
    }

    if (data.domain && !VALID_DOMAINS.includes(data.domain)) {
      return res.status(400).json({ error: 'Please choose a valid domain.' });
    }

    if (data.status && !VALID_STATUSES.includes(data.status)) {
      return res.status(400).json({ error: 'Status must be Review, Approved, Prototype, or Implemented.' });
    }

    const updated = await Idea.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. DELETE IDEA (Owner only)
app.delete('/api/ideas/:id', authenticateToken, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    const ownerId = idea.author?.userId ? String(idea.author.userId) : '';
    if (!ownerId || ownerId !== req.user.id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own project.' });
    }

    const deleted = await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: 'Innovation idea deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. VOTING WITH REPEATED VOTING PREVENTION
// Login required; one user can vote only once per idea.
app.post('/api/ideas/:id/vote', authenticateToken, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const voterIdStr = req.user.id.toString();
    const hasAlreadyVoted = idea.votedBy.some(id => id.toString() === voterIdStr);

    if (hasAlreadyVoted) {
      return res.status(409).json({
        error: 'You have already voted for this idea.',
        votes: idea.votes,
        hasVoted: true
      });
    }

    idea.votedBy.push(req.user.id);
    idea.votes = (idea.votes || 0) + 1;
    await idea.save();
    return res.status(201).json({
      message: 'Vote recorded successfully',
      votes: idea.votes,
      hasVoted: true
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 7. ADD COMMENT
app.post('/api/ideas/:id/comments', optionalAuth, async (req, res) => {
  try {
    const { author, authorRole, comment } = req.body;
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Comment message cannot be empty' });
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    idea.comments.push({
      author: (req.user ? req.user.name : author) || 'Anonymous Student',
      authorRole: (req.user ? req.user.role : authorRole) || 'Student',
      comment: comment.trim(),
      createdAt: new Date()
    });

    await idea.save();
    res.status(201).json(idea);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 8. DASHBOARD ANALYTICS & STATS
app.get('/api/stats', async (req, res) => {
  try {
    const [
      total,
      reviewCount,
      approvedCount,
      prototypeCount,
      implementedCount,
      domainCounts,
      impactCounts,
      voteAgg
    ] = await Promise.all([
      Idea.countDocuments(),
      Idea.countDocuments({ status: 'Review' }),
      Idea.countDocuments({ status: 'Approved' }),
      Idea.countDocuments({ status: 'Prototype' }),
      Idea.countDocuments({ status: 'Implemented' }),
      Idea.aggregate([{ $group: { _id: '$domain', count: { $sum: 1 } } }]),
      Idea.aggregate([{ $group: { _id: '$expectedImpact', count: { $sum: 1 } } }]),
      Idea.aggregate([{ $group: { _id: null, totalVotes: { $sum: '$votes' } } }])
    ]);

    const totalVotes = voteAgg.length > 0 ? voteAgg[0].totalVotes : 0;

    res.json({
      total,
      statusWorkflow: {
        review: reviewCount,
        approved: approvedCount,
        prototype: prototypeCount,
        implemented: implementedCount
      },
      domainCounts: domainCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      impactCounts: impactCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      totalVotes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 10. SEED DATABASE (Includes user 'adi' with pw '000' + 2 projects + 15 voters)
const creatorSeedData = [
  {
    name: 'Aditya (adi)',
    username: 'adi',
    email: 'adi@campus.edu',
    passwordRaw: '000',
    department: 'Computer Science & AI',
    role: 'Innovator',
    projects: [
      {
        title: 'Smart AI Energy Grid & Thermal HVAC Optimization',
        problemStatement: 'Empty lecture halls and research labs continuously consume heavy HVAC cooling and lighting power, costing the university millions in electricity bills.',
        domain: 'AI & Automation',
        description: 'Computer vision thermal occupancy cameras and IoT power relays that automatically throttle air conditioning, ventilation, and lighting based on real-time student occupancy.',
        technologies: ['Python', 'TensorFlow', 'Raspberry Pi', 'MQTT', 'Node.js', 'React'],
        expectedImpact: 'Transformative',
        status: 'Implemented',
        comments: [
          { author: 'Estate Officer', authorRole: 'Admin', comment: 'Energy consumption in Academic Block A dropped by 28% in trials!' }
        ]
      },
      {
        title: 'Campus Autonomous Security Drone Patrol & Vision SOS',
        problemStatement: 'Large perimeter boundaries and isolated study areas face response lag during emergency situations at night.',
        domain: 'Campus Safety & Security',
        description: 'Autonomous waypoint-navigating quadcopter drones with thermal night vision cameras, high-intensity searchlights, and direct siren dispatch paired to campus emergency SOS buttons.',
        technologies: ['PX4 Autopilot', 'Python OpenCV', 'Node.js', 'WebSockets', 'React'],
        expectedImpact: 'Transformative',
        status: 'Prototype',
        comments: [
          { author: 'Dr. Verma', authorRole: 'Mentor', comment: 'Flight corridor testing approved for East Campus perimeter.' }
        ]
      }
    ]
  },
  {
    name: 'Aarav Sharma',
    username: 'aarav',
    email: 'aarav.sharma@campus.edu',
    passwordRaw: 'password123',
    department: 'Computer Science & Engineering',
    role: 'Innovator',
    projects: [
      {
        title: 'Smart AI Waste Segregation & Green Credits Kiosk',
        problemStatement: 'Campus garbage bins overflow with unsegregated recyclables and compostables, leading to landfill contamination and high maintenance costs.',
        domain: 'Sustainability & Green Campus',
        description: 'An edge AI automatic recycling bin using YOLOv8 object detection on Raspberry Pi to classify plastic bottles, tetra packs, and food waste in real-time, crediting student ID cards with cafeteria reward points.',
        technologies: ['Python', 'YOLOv8', 'Raspberry Pi', 'Node.js', 'RFID IoT'],
        expectedImpact: 'High',
        status: 'Prototype',
        comments: [
          { author: 'Dr. R. Kumar', authorRole: 'Faculty', comment: 'Prototype hardware running smoothly in Academic Block 3!' }
        ]
      }
    ]
  },
  {
    name: 'Priya Nair',
    username: 'priya',
    email: 'priya.nair@campus.edu',
    passwordRaw: 'password123',
    department: 'Electrical & Electronics',
    role: 'Innovator',
    projects: [
      {
        title: 'Autonomous Solar EV Shuttle Tracker & Mobility Booking',
        problemStatement: 'Long commute wait times between hostel blocks and academic centers with crowded electric shuttles and no real-time arrival visibility.',
        domain: 'Smart Campus & IoT',
        description: 'Real-time GPS tracking and dynamic seat reservation mobile app for electric campus carts, prioritizing differently-abled students and powered by rooftop solar charging docks.',
        technologies: ['React Native', 'Node.js', 'ESP32 GPS', 'MQTT', 'WebSockets'],
        expectedImpact: 'High',
        status: 'Approved',
        comments: [
          { author: 'Prof. S. Iyer', authorRole: 'Faculty', comment: 'Approved for trial on East Campus shuttle route.' }
        ]
      }
    ]
  },
  {
    name: 'Rohan Verma',
    username: 'rohan',
    email: 'rohan.verma@campus.edu',
    passwordRaw: 'password123',
    department: 'Information Technology',
    role: 'Student',
    projects: [
      {
        title: 'Peer-to-Peer Academic Kit & Textbook Exchange Marketplace',
        problemStatement: 'Students spend thousands each semester on textbooks and lab hardware kits that sit unused after semester exams.',
        domain: 'Academic & EdTech',
        description: 'A verified student-to-student sharing and lending web platform for textbooks, Arduino/FPGA development boards, and curated lecture study guides with zero middleman fees.',
        technologies: ['React', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        expectedImpact: 'Medium',
        status: 'Implemented',
        comments: [
          { author: 'Karan', authorRole: 'Student', comment: 'Saved ₹2,500 on my 3rd sem lab kits using this platform!' }
        ]
      }
    ]
  },
  {
    name: 'Ananya Patel',
    username: 'ananya',
    email: 'ananya.patel@campus.edu',
    passwordRaw: 'password123',
    department: 'Biotechnology & Health Sciences',
    role: 'Innovator',
    projects: [
      {
        title: 'Anonymous Campus Mental Health Support & Counselor Connect',
        problemStatement: 'Social stigma and scheduling barriers prevent distressed students from seeking timely psychological counseling and wellness support.',
        domain: 'Healthcare & Well-being',
        description: 'An end-to-end encrypted peer listener chat platform and confidential appointment booking kiosk connecting students with certified campus counselors 24/7.',
        technologies: ['React', 'WebRTC', 'AES-256 Encryption', 'Node.js'],
        expectedImpact: 'Transformative',
        status: 'Review',
        comments: [
          { author: 'Campus Counselor', authorRole: 'Mentor', comment: 'Reviewing compliance and data anonymity protocols.' }
        ]
      }
    ]
  },
  {
    name: 'Vikram Singh',
    username: 'vikram',
    email: 'vikram.singh@campus.edu',
    passwordRaw: 'password123',
    department: 'Electronics & Communication',
    role: 'Innovator',
    projects: [
      {
        title: 'Emergency SOS Mesh Network & Safe Night Walk Beacons',
        problemStatement: 'Dimly lit walking trails and blind spots across large campus perimeters lack quick emergency assistance during late night hours.',
        domain: 'Campus Safety & Security',
        description: 'Solar-powered BLE emergency poles with 360-degree night vision cameras, instant loud sirens, and companion mobile SOS beacons dispatching campus security within seconds.',
        technologies: ['BLE Mesh', 'ESP32', 'Python OpenCV', 'Node.js'],
        expectedImpact: 'Transformative',
        status: 'Prototype',
        comments: []
      }
    ]
  },
  {
    name: 'Kavita Menon',
    username: 'kavita',
    email: 'kavita.menon@campus.edu',
    passwordRaw: 'password123',
    department: 'Civil & Environmental Engineering',
    role: 'Student',
    projects: [
      {
        title: 'Mess Food Surplus Redistribution to Local Community Shelters',
        problemStatement: 'Hundreds of kilograms of freshly cooked cafeteria food are wasted daily while local orphanages and shelters within 5km face hunger.',
        domain: 'Community & Social Impact',
        description: 'An automated dispatch application notifying verified local charity volunteers and food banks of surplus meal batches for sanitized collection within 45 minutes.',
        technologies: ['React', 'Twilio SMS API', 'Express.js', 'MongoDB'],
        expectedImpact: 'High',
        status: 'Approved',
        comments: [
          { author: 'Mess Committee', authorRole: 'Faculty', comment: 'Over 250 kg of meals safely shared in the past month.' }
        ]
      }
    ]
  },
  {
    name: 'Sneha Roy',
    username: 'sneha',
    email: 'sneha.roy@campus.edu',
    passwordRaw: 'password123',
    department: 'Management & Fintech',
    role: 'Student',
    projects: [
      {
        title: 'Decentralized Campus Micro-Grants & Event Crowdfunding',
        problemStatement: 'Student clubs and technical project teams struggle with bureaucratic funding delays for hackathons and prototype materials.',
        domain: 'Fintech & Student Economy',
        description: 'A transparent micro-grant platform where student teams post milestone budgets and receive verified micro-sponsorships directly from alumni and department funds.',
        technologies: ['React', 'Node.js', 'Express.js', 'MongoDB'],
        expectedImpact: 'Medium',
        status: 'Review',
        comments: []
      }
    ]
  }
];

const voterUsersSeedData = [
  { name: 'Rahul Joshi', username: 'rahul_j', email: 'rahul.joshi@campus.edu', department: 'Mechanical Eng' },
  { name: 'Divya Kapoor', username: 'divya_k', email: 'divya.kapoor@campus.edu', department: 'Computer Science' },
  { name: 'Manish Pandey', username: 'manish_p', email: 'manish.pandey@campus.edu', department: 'Information Tech' },
  { name: 'Siddharth Rao', username: 'sid_rao', email: 'siddharth.rao@campus.edu', department: 'Electronics Eng' },
  { name: 'Pooja Hegde', username: 'pooja_h', email: 'pooja.hegde@campus.edu', department: 'Biotechnology' },
  { name: 'Nikhil Saxena', username: 'nikhil_s', email: 'nikhil.saxena@campus.edu', department: 'Civil Eng' },
  { name: 'Meera Nambiar', username: 'meera_n', email: 'meera.nambiar@campus.edu', department: 'Electrical Eng' },
  { name: 'Varun Dhawan', username: 'varun_d', email: 'varun.dhawan@campus.edu', department: 'Chemical Eng' },
  { name: 'Tanvi Deshmukh', username: 'tanvi_d', email: 'tanvi.deshmukh@campus.edu', department: 'Computer Science' },
  { name: 'Harish Reddy', username: 'harish_r', email: 'harish.reddy@campus.edu', department: 'Information Tech' },
  { name: 'Shreya Goswami', username: 'shreya_g', email: 'shreya.goswami@campus.edu', department: 'Management' },
  { name: 'Kunal Malhotra', username: 'kunal_m', email: 'kunal.malhotra@campus.edu', department: 'Computer Science' },
  { name: 'Ritu Bhatt', username: 'ritu_b', email: 'ritu.bhatt@campus.edu', department: 'Electronics Eng' },
  { name: 'Arjun Das', username: 'arjun_d', email: 'arjun.das@campus.edu', department: 'Mechanical Eng' },
  { name: 'Bhavna Chauhan', username: 'bhavna_c', email: 'bhavna.chauhan@campus.edu', department: 'Biotechnology' }
];

const reducedCreatorSeedData = [
  {
    name: 'Aditya (adi)',
    username: 'adi',
    email: 'adi@campus.edu',
    passwordRaw: '000',
    department: 'Computer Science & AI',
    role: 'Innovator',
    projects: [
      {
        title: 'Smart AI Energy Grid & Thermal HVAC Optimization',
        problemStatement: 'Empty lecture halls and research labs continuously consume heavy HVAC cooling and lighting power, costing the university millions in electricity bills.',
        domain: 'AI & Automation',
        description: 'Computer vision thermal occupancy cameras and IoT power relays that automatically throttle air conditioning, ventilation, and lighting based on real-time student occupancy.',
        technologies: ['Python', 'TensorFlow', 'Raspberry Pi', 'MQTT', 'Node.js', 'React'],
        expectedImpact: 'Transformative',
        status: 'Implemented',
        comments: []
      },
      {
        title: 'Campus Autonomous Security Drone Patrol & Vision SOS',
        problemStatement: 'Large perimeter boundaries and isolated study areas face response lag during emergency situations at night.',
        domain: 'Campus Safety & Security',
        description: 'Autonomous waypoint-navigating quadcopter drones with thermal night vision cameras, high-intensity searchlights, and direct siren dispatch paired to campus emergency SOS buttons.',
        technologies: ['PX4 Autopilot', 'Python OpenCV', 'Node.js', 'WebSockets', 'React'],
        expectedImpact: 'Transformative',
        status: 'Prototype',
        comments: []
      }
    ]
  },
  {
    name: 'Aarav Sharma',
    username: 'aarav',
    email: 'aarav.sharma@campus.edu',
    passwordRaw: 'password123',
    department: 'Computer Science & Engineering',
    role: 'Innovator',
    projects: [
      {
        title: 'Smart AI Waste Segregation & Green Credits Kiosk',
        problemStatement: 'Campus garbage bins overflow with unsegregated recyclables and compostables, leading to landfill contamination and high maintenance costs.',
        domain: 'Sustainability & Green Campus',
        description: 'An edge AI automatic recycling bin using YOLOv8 object detection on Raspberry Pi to classify plastic bottles, tetra packs, and food waste in real-time, crediting student ID cards with cafeteria reward points.',
        technologies: ['Python', 'YOLOv8', 'Raspberry Pi', 'Node.js', 'RFID IoT'],
        expectedImpact: 'High',
        status: 'Prototype',
        comments: []
      }
    ]
  },
  {
    name: 'Priya Nair',
    username: 'priya',
    email: 'priya.nair@campus.edu',
    passwordRaw: 'password123',
    department: 'Electrical & Electronics',
    role: 'Innovator',
    projects: [
      {
        title: 'Autonomous Solar EV Shuttle Tracker & Mobility Booking',
        problemStatement: 'Long commute wait times between hostel blocks and academic centers with crowded electric shuttles and no real-time arrival visibility.',
        domain: 'Smart Campus & IoT',
        description: 'Real-time GPS tracking and dynamic seat reservation mobile app for electric campus carts, prioritizing differently-abled students and powered by rooftop solar charging docks.',
        technologies: ['React Native', 'Node.js', 'ESP32 GPS', 'MQTT', 'WebSockets'],
        expectedImpact: 'High',
        status: 'Approved',
        comments: []
      }
    ]
  },
  {
    name: 'Rohan Verma',
    username: 'rohan',
    email: 'rohan.verma@campus.edu',
    passwordRaw: 'password123',
    department: 'Information Technology',
    role: 'Student',
    projects: [
      {
        title: 'Peer-to-Peer Academic Kit & Textbook Exchange Marketplace',
        problemStatement: 'Students spend thousands each semester on textbooks and lab hardware kits that sit unused after semester exams.',
        domain: 'Academic & EdTech',
        description: 'A verified student-to-student sharing and lending web platform for textbooks, Arduino/FPGA development boards, and curated lecture study guides with zero middleman fees.',
        technologies: ['React', 'Express.js', 'MongoDB', 'Tailwind CSS'],
        expectedImpact: 'Medium',
        status: 'Review',
        comments: []
      }
    ]
  }
];

const reducedVoterUsersData = [
  { name: 'Meera Nambiar', username: 'meera_n', email: 'meera.nambiar@campus.edu', department: 'Electrical Eng' },
  { name: 'Varun Dhawan', username: 'varun_d', email: 'varun.dhawan@campus.edu', department: 'Chemical Eng' },
  { name: 'Tanvi Deshmukh', username: 'tanvi_d', email: 'tanvi.deshmukh@campus.edu', department: 'Computer Science' },
  { name: 'Harish Reddy', username: 'harish_r', email: 'harish.reddy@campus.edu', department: 'Information Tech' },
  { name: 'Shreya Goswami', username: 'shreya_g', email: 'shreya.goswami@campus.edu', department: 'Management' },
  { name: 'Kunal Malhotra', username: 'kunal_m', email: 'kunal.malhotra@campus.edu', department: 'Computer Science' },
  { name: 'Ritu Bhatt', username: 'ritu_b', email: 'ritu.bhatt@campus.edu', department: 'Electronics Eng' }
];

app.post('/api/seed', async (req, res) => {
  try {
    await mongoose.connection.dropDatabase();

    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);
    const adiPasswordHash = await bcrypt.hash('000', salt);

    // Create Creators
    const createdCreators = [];
    const allIdeasToInsert = [];

    for (const c of reducedCreatorSeedData) {
      const passwordToUse = (c.username === 'adi') ? adiPasswordHash : defaultPasswordHash;
      const user = await User.create({
        name: c.name,
        username: c.username.toLowerCase(),
        email: c.email.toLowerCase(),
        password: passwordToUse,
        department: c.department,
        role: c.role
      });
      createdCreators.push(user);

      for (const proj of c.projects) {
        allIdeasToInsert.push(new Idea({
          ...proj,
          author: {
            userId: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          },
          votes: 0,
          votedBy: []
        }));
      }
    }

    // Create 7 Voters
    const createdVoters = [];
    for (const v of reducedVoterUsersData) {
      const user = await User.create({
        name: v.name,
        username: v.username.toLowerCase(),
        email: v.email.toLowerCase(),
        password: defaultPasswordHash,
        department: v.department,
        role: 'Student'
      });
      createdVoters.push(user);
    }

    // Distribute Votes: each of 7 voters votes for >= 5 projects
    for (let i = 0; i < createdVoters.length; i++) {
      const voter = createdVoters[i];
      const voteCount = (i % 2 === 0) ? 6 : 5;
      for (let j = 0; j < voteCount; j++) {
        const projectIndex = (i + j) % allIdeasToInsert.length;
        const targetIdea = allIdeasToInsert[projectIndex];
        if (!targetIdea.votedBy.some(id => id.toString() === voter._id.toString())) {
          targetIdea.votedBy.push(voter._id);
          targetIdea.votes += 1;
        }
      }
    }

    for (const idea of allIdeasToInsert) {
      await idea.save();
    }

    res.json({
      message: 'Demo ideas, user "adi" with password "000" (2 projects), and 7 voters seeded successfully',
      creatorsCount: createdCreators.length,
      votersCount: createdVoters.length,
      ideasCount: allIdeasToInsert.length,
      specialUser: {
        username: 'adi',
        email: 'adi@campus.edu',
        password: '000',
        projectsCount: 2
      },
      ideas: allIdeasToInsert
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Campus Hub Server running on port ${PORT}`));
}

module.exports = app;
