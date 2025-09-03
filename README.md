# Simple CRM - Docker Compose

A complete Customer Relationship Management (CRM) system built with modern technologies and containerized with Docker Compose.

## 🚀 Tech Stack

- **Frontend**: React.js with TypeScript, Vite & Tailwind CSS
- **Backend**: Express.js with TypeScript (Node.js)
- **Databases**: MongoDB & PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Language**: TypeScript
- **Build Tool**: Vite

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

4. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017
   - PostgreSQL: localhost:5432

## 📁 Project Structure

```
GitHub-simple-CRM/
├── docker-compose.yml          # Main Docker Compose configuration
├── package.json                # Root package.json with Docker scripts
├── backend/                   # Express.js API
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
├── frontend/                  # React.js application
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── public/
│   └── src/
├── mongo-init/               # MongoDB initialization scripts
│   └── init.js
└── postgres-init/            # PostgreSQL initialization scripts
    └── 01-init.sql
```

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

# Execute commands in containers
docker-compose exec backend npm run lint
docker-compose exec frontend npm run build
```

## 🔧 Services Configuration

### MongoDB
- **Port**: 27017
- **Database**: crm
- **Username**: admin
- **Password**: password123
- **Features**: 
  - Collections: customers, orders, products
  - Sample data included
  - Indexes for performance

### PostgreSQL
- **Port**: 5432
- **Database**: crm
- **Username**: admin
- **Password**: password123
- **Features**:
  - Tables: customers, orders, order_items
  - Foreign key relationships
  - Triggers for updated_at timestamps
  - Sample data included

### Express.js Backend (TypeScript)
- **Port**: 5000
- **Features**:
  - RESTful API endpoints with TypeScript
  - MongoDB & PostgreSQL connections
  - CORS enabled
  - Security middleware (helmet)
  - Request logging (morgan)
  - Uses shared packages for types and utilities
  - ESLint with TypeScript rules
  - Strict type checking

### React.js Frontend (TypeScript + Vite)
- **Port**: 3000
- **Features**:
  - Modern UI with Tailwind CSS
  - Real-time database status monitoring
  - Responsive design
  - API integration with TypeScript
  - Uses shared packages for types and utilities
  - ESLint with TypeScript and React rules
  - Strict type checking
  - Lightning-fast development with Vite
  - Hot Module Replacement (HMR)
  - Optimized production builds

## 📦 Container Structure

### Backend Container
- Express.js API with TypeScript
- MongoDB and PostgreSQL connections
- RESTful endpoints
- Security middleware
- Hot reloading with nodemon

### Frontend Container
- React.js with TypeScript and Vite
- Modern UI with Tailwind CSS
- Real-time database status monitoring
- Hot Module Replacement (HMR)
- Optimized production builds

## 🎯 Available Endpoints

### Backend API
- `GET /` - API welcome message
- `GET /health` - Health check with database status
- `GET /api/customers` - Get customers (MongoDB)
- `GET /api/orders` - Get orders (PostgreSQL)

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

# Query customers
db.customers.find()
```

### PostgreSQL
```bash
# Connect to PostgreSQL container
docker exec -it crm-postgresql psql -U admin -d crm

# List tables
\dt

# Query customers
SELECT * FROM customers;
```

## 🛡️ Security Notes

⚠️ **Important**: This is a development setup. For production:

1. Change all default passwords
2. Use environment variables for sensitive data
3. Enable SSL/TLS
4. Implement proper authentication
5. Use secrets management
6. Configure firewall rules

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

# Frontend (Vite)
VITE_API_URL=http://your-api-domain:5000
VITE_ENV=production
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 5000, 27017, and 5432 are available
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

## 📊 Monitoring

The frontend includes a real-time dashboard showing:
- Database connection status
- System information
- Quick action buttons

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
