# GitHub Simple CRM

A modern Customer Relationship Management (CRM) system with GitHub integration, built with TypeScript, React, and Express.js, containerized with Docker Compose.

## 🚀 Tech Stack

- **Frontend**: React.js with TypeScript, Vite & Tailwind CSS
- **Backend**: Express.js with TypeScript (Node.js)
- **Databases**: MongoDB (for projects) & PostgreSQL (for users)
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT with bcrypt
- **GitHub Integration**: GitHub API for repository management

## 📋 Prerequisites

- Docker
- Docker Compose
- Git

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GitHub-simple-CRM
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - MongoDB: localhost:27017
   - PostgreSQL: localhost:5432

## 📁 Project Structure

```
GitHub-simple-CRM/
├── docker-compose.yml          # Main Docker Compose configuration
├── README.md                   # This file
├── backend/                    # Express.js API with TypeScript
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts           # Main server entry point
│       ├── db-connectors/      # Database connection modules
│       │   ├── index.ts
│       │   ├── config.ts
│       │   ├── mongodb.ts
│       │   ├── postgresql.ts
│       │   └── README.md
│       ├── middleware/         # Express middleware
│       │   ├── auth.ts
│       │   ├── cors.ts
│       │   ├── errorHandler.ts
│       │   └── README.md
│       ├── models/             # Data models
│       │   ├── User.ts         # PostgreSQL User model
│       │   └── Project.ts      # MongoDB Project model
│       ├── routes/             # API route handlers
│       │   ├── index.ts        # Route registration
│       │   ├── auth.ts         # Authentication routes
│       │   ├── projects.ts     # Project management routes
│       │   ├── github.ts       # GitHub integration routes
│       │   └── README.md
│       └── services/           # Business logic services
│           └── githubService.ts
├── frontend/                   # React.js application
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── public/
│   │   ├── manifest.json
│   │   └── icon.svg
│   └── src/
│       ├── index.tsx           # App entry point
│       ├── App.tsx             # Main app component
│       ├── AppRoutes.tsx       # Route configuration
│       ├── contexts/           # React contexts
│       │   └── AuthContext.tsx
│       ├── pages/              # Page components
│       │   ├── AuthPage.tsx
│       │   └── Dashboard.tsx
│       ├── components/         # Reusable components
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── ProjectList.tsx
│       │   ├── ProjectForm.tsx
│       │   └── GitHubRepoForm.tsx
│       └── vite-env.d.ts
├── mongo-init/                 # MongoDB initialization scripts
│   └── init.js
└── postgres-init/              # PostgreSQL initialization scripts
    └── 01-init.sql
```

## 🎯 Features

### 🔐 Authentication System
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes

### 📊 Project Management
- Create, read, update, delete projects
- User-specific project filtering
- Project metadata storage

### 🔗 GitHub Integration
- Add GitHub repositories by path (e.g., "facebook/react")
- Fetch repository data from GitHub API
- Store repository metadata (stars, forks, issues, etc.)
- Repository existence validation

### 🎨 Modern UI/UX
- Clean, minimalistic design with Tailwind CSS
- Responsive layout
- Real-time notifications with react-hot-toast
- Form validation with react-hook-form

## 🎯 Project Commands

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

### Individual Container Commands
```bash
# Start only databases
docker-compose up -d mongodb postgresql

# Start only backend
docker-compose up -d backend

# Start only frontend
docker-compose up -d frontend

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Container Management
```bash
# Rebuild specific container
docker-compose build backend
docker-compose build frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

## 🔧 Services Configuration

### MongoDB
- **Port**: 27017
- **Database**: crm
- **Username**: admin
- **Password**: password123
- **Purpose**: Stores project data and GitHub repository information

### PostgreSQL
- **Port**: 5432
- **Database**: crm
- **Username**: admin
- **Password**: password123
- **Purpose**: Stores user authentication data

### Express.js Backend (TypeScript)
- **Port**: 5001 (changed from 5000 to avoid conflicts)
- **Features**:
  - Modular architecture with separated concerns
  - Database connectors for MongoDB and PostgreSQL
  - Middleware for CORS, authentication, and error handling
  - Centralized route registration
  - GitHub API integration
  - JWT authentication
  - TypeScript with strict type checking

### React.js Frontend (TypeScript + Vite)
- **Port**: 3000
- **Features**:
  - Modern UI with Tailwind CSS
  - Authentication flow with protected routes
  - Project management interface
  - GitHub repository integration
  - Real-time notifications
  - Form validation
  - Responsive design
  - Hot Module Replacement (HMR)

## 🎯 Available Endpoints

### Backend API
- `GET /health` - Health check with database status
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/github/check/:repoPath` - Check if GitHub repository exists
- `POST /api/github` - Add GitHub repository to projects

## 🐳 Docker Commands

### Start services
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
docker-compose logs -f postgresql
```

### Stop services
```bash
docker-compose down
```

### Rebuild services
```bash
docker-compose up -d --build
```

### Remove everything (including volumes)
```bash
docker-compose down -v
```

## 🔍 Database Access

### MongoDB
```bash
# Connect to MongoDB container
docker exec -it crm-mongodb mongosh -u admin -p password123

# Use CRM database
use crm

# List collections
show collections

# Query projects
db.projects.find()
```

### PostgreSQL
```bash
# Connect to PostgreSQL container
docker exec -it crm-postgresql psql -U admin -d crm

# List tables
\dt

# Query users
SELECT * FROM users;
```

## 🛡️ Security Notes

⚠️ **Important**: This is a development setup. For production:

1. Change all default passwords
2. Use environment variables for sensitive data
3. Enable SSL/TLS
4. Implement proper authentication
5. Use secrets management
6. Configure firewall rules
7. Set up proper CORS configuration

## 🔧 Development

### Adding new features
1. Modify backend code in `backend/` directory
2. Modify frontend code in `frontend/` directory
3. Rebuild containers: `docker-compose up -d --build`

### Database migrations
- MongoDB: Add scripts to `mongo-init/`
- PostgreSQL: Add SQL files to `postgres-init/`

### Environment variables
Create a `.env` file in the root directory to override default values:

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=your_username
MONGO_INITDB_ROOT_PASSWORD=your_password

# PostgreSQL
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password

# Backend
JWT_SECRET=your_jwt_secret
NODE_ENV=production
PORT=5001

# Frontend (Vite)
VITE_API_URL=http://your-api-domain:5001
VITE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5001, 27017, and 5432 are available
2. **Permission issues**: Run with `sudo` if needed
3. **Database connection errors**: Check if databases are fully initialized
4. **Frontend not loading**: Check if backend is running and accessible
5. **Container build issues**: Run `docker-compose build --no-cache` to rebuild from scratch

### Reset everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
docker-compose up -d --build
```

## 📊 System Architecture

The application follows a modular architecture:

- **Database Layer**: Hybrid approach with MongoDB for projects and PostgreSQL for users
- **Backend Layer**: Modular Express.js with separated concerns (routes, middleware, models, services)
- **Frontend Layer**: React.js with TypeScript, organized by features (pages, components, contexts)
- **Container Layer**: Docker Compose for easy deployment and development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉**
