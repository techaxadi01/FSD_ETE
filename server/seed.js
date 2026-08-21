require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// --- SCHEMAS ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  department: { type: String, default: 'Computer Science & Engineering' },
  role: { type: String, default: 'Student' }
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  author: String,
  authorRole: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemStatement: { type: String, required: true },
  domain: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  expectedImpact: { type: String, required: true },
  status: { type: String, enum: ['Review', 'Approved', 'Prototype', 'Implemented'], default: 'Review' },
  votes: { type: Number, default: 0 },
  votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  author: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    username: String,
    email: String
  },
  comments: [commentSchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Idea = mongoose.model('Idea', ideaSchema);

const reducedCreatorData = [
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

const getRandomVoteCount = (maxVotes) => {
  if (maxVotes <= 1) return maxVotes;
  return Math.floor(Math.random() * maxVotes) + 1;
};

const shuffleArray = (items) => [...items].sort(() => Math.random() - 0.5);

// --- 8 PROJECT CREATORS (INCLUDING 'adi' WITH 2 PROJECTS) ---
const creatorData = [
  {
    name: 'Aditya (adi)',
    username: 'adi',
    email: 'adi@campus.edu',
    passwordRaw: '000', // Password '000' as requested
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

// --- 15 DEDICATED VOTER USERS (WITH UNIQUE USERNAMES & EMAILS) ---
const voterUsersData = [
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

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Drop the database completely before reseeding
    console.log('Dropping existing database...');
    await mongoose.connection.dropDatabase();
    console.log('Database dropped.');

    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);
    const adiPasswordHash = await bcrypt.hash('000', salt); // Specific pw '000' for adi

    // 2. Create Creators (including adi)
    const createdCreators = [];
    const allIdeasToInsert = [];

    for (const c of reducedCreatorData) {
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

      // Prepare their projects
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
    console.log(`Created ${createdCreators.length} project creator users.`);

    // 3. Create the 15 Dedicated Voter Users
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
    console.log(`Created ${createdVoters.length} voter users.`);

    // 4. Distribute Votes: randomized counts per idea with no repeated voting
    const shuffledVoters = shuffleArray(createdVoters);
    const votePlan = allIdeasToInsert.map(() => getRandomVoteCount(createdVoters.length));

    for (let i = 0; i < createdVoters.length; i++) {
      const voter = shuffledVoters[i];
      const votesForThisVoter = votePlan[i % votePlan.length];
      const ideasToVote = shuffleArray(allIdeasToInsert).slice(0, votesForThisVoter);

      for (const targetIdea of ideasToVote) {
        if (!targetIdea.votedBy.some(id => id.toString() === voter._id.toString())) {
          targetIdea.votedBy.push(voter._id);
          targetIdea.votes += 1;
        }
      }
    }

    // Save all ideas
    for (const idea of allIdeasToInsert) {
      await idea.save();
    }
    console.log(`Saved ${allIdeasToInsert.length} innovation projects to database.`);

    // 5. Verification & Report
    console.log('\n================ SEEDING COMPLETE ================');
    console.log(`👥 Total Users Created: ${createdCreators.length + createdVoters.length}`);
    console.log(`🌟 Special User:`);
    console.log(`   - Username: "adi"`);
    console.log(`   - Password: "000"`);
    console.log(`   - Email:    "adi@campus.edu"`);
    const adiProjects = allIdeasToInsert.filter(i => i.author.username === 'adi');
    console.log(`   - Total Projects Owned: ${adiProjects.length}`);
    adiProjects.forEach((p, idx) => console.log(`     ${idx + 1}. [${p.status}] ${p.title}`));

    console.log(`\n💡 Total Innovation Projects: ${allIdeasToInsert.length}`);
    console.log('   - Review:       ' + allIdeasToInsert.filter(i => i.status === 'Review').length);
    console.log('   - Approved:     ' + allIdeasToInsert.filter(i => i.status === 'Approved').length);
    console.log('   - Prototype:    ' + allIdeasToInsert.filter(i => i.status === 'Prototype').length);
    console.log('   - Implemented:  ' + allIdeasToInsert.filter(i => i.status === 'Implemented').length);

    console.log('\n🗳️ Voter Verification (Randomized vote counts):');
    for (const voter of createdVoters) {
      const userVotes = allIdeasToInsert.filter(i => i.votedBy.some(id => id.toString() === voter._id.toString())).length;
      console.log(`   - ${voter.name} (@${voter.username} | ${voter.email}): ${userVotes} votes`);
    }
    console.log('==================================================\n');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();
