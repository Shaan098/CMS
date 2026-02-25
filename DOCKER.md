# 🐳 Docker Setup for CMS Application

This guide will help you run the CMS application using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually comes with Docker Desktop)

## Quick Start

### 1. Environment Setup

First, create your `.env` file from the example template:

```bash
# Copy the example file (Windows)
copy .env.example backend\.env

# Or for Linux/Mac
cp .env.example backend/.env
```

Then edit `backend/.env` with your actual credentials.

### 2. Choose Your Database

You have two options for MongoDB:

#### Option A: Use Local MongoDB Container (Recommended for Development)

In `docker-compose.yml`, ensure the backend service has this environment variable:
```yaml
MONGODB_URI: mongodb://admin:admin123@mongodb:27017/cms_db?authSource=admin
```

Or uncomment the local MongoDB line in your `backend/.env`:
```
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/cms_db?authSource=admin
```

#### Option B: Use MongoDB Atlas (Recommended for Production)

Keep your existing MongoDB Atlas connection string in `backend/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cms_db?retryWrites=true&w=majority
```

### 3. Build and Run

Build and start all services:

```bash
docker-compose up --build
```

Or run in detached mode (background):

```bash
docker-compose up -d --build
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB** (if using local): localhost:27017

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Check Service Status

```bash
docker-compose ps
```

### Stop Services

```bash
docker-compose down
```

### Stop Services and Remove Volumes

```bash
docker-compose down -v
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### Restart a Specific Service

```bash
docker-compose restart backend
```

## Troubleshooting

### Backend Can't Connect to MongoDB

**If using local MongoDB:**
- Ensure MongoDB service is healthy: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify connection string uses `mongodb://admin:admin123@mongodb:27017/cms_db?authSource=admin`

**If using MongoDB Atlas:**
- Verify your connection string is correct in `backend/.env`
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check backend logs: `docker-compose logs backend`

### Port Already in Use

If you get an error like "port 3000 is already allocated":

1. Stop the conflicting service
2. Or change the port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:80"  # Change 3000 to 3001 or any free port
   ```

### Frontend Can't Reach Backend

- Ensure both services are on the same Docker network
- Check that nginx.conf proxies to `http://backend:5000`
- Verify backend is healthy: `docker-compose ps`

### Clean Slate

To remove all containers, volumes, and start fresh:

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Development Workflow

For active development, you might want to use volume mounts to avoid rebuilding:

1. Add volume mounts to `docker-compose.yml`:
   ```yaml
   backend:
     volumes:
       - ./backend:/app
       - /app/node_modules
   ```

2. Use `npm run dev` in the Dockerfile CMD for hot-reloading

## Production Deployment

For production deployments:

1. Use MongoDB Atlas (not local container)
2. Set strong `JWT_SECRET` in environment variables
3. Set `NODE_ENV=production`
4. Consider using Docker Swarm or Kubernetes for orchestration
5. Set up SSL/TLS certificates for HTTPS
6. Use a reverse proxy like Traefik or Nginx Proxy Manager

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │────────▶│   Frontend  │────────▶│   Backend   │
│             │         │  (nginx)    │         │ (Node.js)   │
└─────────────┘         │  Port 3000  │         │  Port 5000  │
                        └─────────────┘         └──────┬──────┘
                                                       │
                                                       ▼
                                                ┌─────────────┐
                                                │   MongoDB   │
                                                │  Port 27017 │
                                                └─────────────┘
```

All services communicate via Docker's internal network `cms-network`.

## Support

For issues or questions, please check the logs first using `docker-compose logs`.
