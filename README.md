<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  <h1>NestJS Image Server</h1>
  <p>Image processing server with robust logging and cloud integration</p>

  <div>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
    <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
    <img src="https://img.shields.io/badge/Clerk-000000?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  </div>
</div>

## 🚀 Quick Start

```bash
# Start development server
pnpm run start:dev
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖼️ Image Processing | Advanced image management and processing capabilities |
| 🔒 Authentication | Secure auth with Clerk and Google OAuth |
| 📝 Logging | Winston-based logging with file rotation |
| 🐳 Containerization | Docker support for easy deployment |
| 🗄️ Database | PostgreSQL with Prisma ORM |
| 🔄 CI/CD | Automated deployment with GitHub Actions |
| 🚀 Cloud | AWS EC2 deployment support |
| 📚 API Documentation | Interactive Swagger UI documentation |

## ⚙️ Configuration

### Environment Setup

```env
# Application
PORT=3001
ALLOWED_ORIGINS=["http://localhost:3001"]
FRONTEND_URL=http://localhost:3001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Image Storage
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,image/avif
```

## 📚 API Documentation

The API documentation is available through Swagger UI at `/api/docs` when the server is running.

### Swagger UI Features

- Interactive API documentation
- Try-it-out functionality
- Request/response examples
- Bearer token authentication
- Schema validation
- API versioning

## 📝 Logging

The application implements a comprehensive logging system using Winston:

- **Console Output**: Colored, formatted logs
- **File Logs**: 
  - `logs/error.log`: Error-specific logs
  - `logs/combined.log`: All application logs
- **Features**:
  - Request/response logging
  - Error stack traces

Configure log level via environment:
```env
LOG_LEVEL=debug  # Options: error, warn, info, debug, verbose
```

## 🚀 Deployment

### GitHub Actions Setup

Required secrets:
- `DOCKER_USERNAME`
- `DOCKER_TOKEN`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`

Deploy by pushing to main branch.
