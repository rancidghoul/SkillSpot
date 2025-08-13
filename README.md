# SkillPlot - Visual Resume & Career Mapper

A full-stack web application for creating visual resumes, tracking skill progression, and mapping career development with interactive visualizations.

## 🚀 Features

### Core Functionality
- **Interactive Skill Graphs**: Visualize skill proficiency over time using D3.js
- **Project Timeline**: Showcase projects with a beautiful timeline interface
- **Job Matching**: Match your skills with job requirements
- **Resume Export**: Generate printable PDF resumes
- **Public Portfolio**: Share your professional profile publicly
- **Comparison Dashboard**: Compare your skills vs job requirements

### User Management
- **Authentication**: Secure JWT-based user authentication
- **User Profiles**: Personalize your career profile
- **Protected Routes**: Secure access to personal data

### Data Management
- **CRUD Operations**: Full Create, Read, Update, Delete for skills and projects
- **Real-time Updates**: Live data synchronization
- **Data Validation**: Comprehensive input validation
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **D3.js** - Data visualization library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons
- **React-to-Print** - PDF generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Jest** - Testing framework
- **Nodemon** - Development server
- **ESLint** - Code linting

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillplot.git
   cd skillplot
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Configuration**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/skillplot
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Run database cleanup script (if needed)
   cd server
   node scripts/cleanup-db.js
   ```

5. **Start the application**
   ```bash
   # Start backend server (from server directory)
   npm start
   
   # Start frontend (from client directory, in new terminal)
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 🗂️ Project Structure

```
skillplot/
├── client/                 # React frontend
│   ├── public/            # Static files
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # App entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Database scripts
│   └── server.js         # Server entry point
├── README.md
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user

### Skills
- `GET /api/skills` - Get user skills
- `POST /api/skills` - Add new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `GET /api/skills/:userId` - Get public skills

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Add new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:userId` - Get public projects

### Jobs
- `GET /api/jobs` - Get job listings
- `POST /api/jobs` - Add job listing
- `GET /api/jobs/match` - Get job matches

## 🎨 Features Overview

### Dashboard
- Real-time statistics
- Quick action buttons
- Skill comparison charts
- Recent activity feed

### Skills Management
- Add/edit/delete skills
- Track proficiency over time
- Interactive skill graphs
- Multiple proficiency entries

### Project Portfolio
- Project timeline visualization
- Add/edit/delete projects
- Tag-based categorization
- Project links and images

### Job Matching
- Skill-based job matching
- Match percentage calculation
- Job requirement comparison
- Skill gap analysis

### Resume Export
- PDF generation
- Professional formatting
- Skills and projects inclusion
- Print-friendly design

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting platform

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy the server directory
3. Configure MongoDB connection

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
CLIENT_URL=your_frontend_url
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- D3.js for data visualization
- Tailwind CSS for styling
- React community for excellent documentation
- MongoDB for database solution

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: your-email@example.com
- Documentation: [Wiki](link-to-wiki)

---

**SkillPlot** - Visualize your career journey with style! 🚀 