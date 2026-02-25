# CMS System - Full Stack MERN + JWT

A modern, premium Content Management System built with the MERN stack featuring **3D interactive design**, glassmorphism effects, JWT authentication, and role-based access control.

## ✨ Features

### 🎨 Premium 3D Interactive UI
- **Glassmorphism Design** - Beautiful frosted glass effects
- **3D Floating Particles** - Animated background particles
- **Smooth Animations** - Micro-interactions and transitions
- **Gradient Accents** - Vibrant color palette with deep space theme
- **Responsive Design** - Works on all devices

### 🔒 Security
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for passwords
- **Role-Based Access Control** - Admin and User roles
- **Protected Routes** - Frontend and backend route protection

### 📝 Content Management
- **CRUD Operations** - Create, Read, Update, Delete CMS content
- **User Management** - Admin can manage users and roles
- **System Reports** - View statistics and recent activity
- **Settings Management** - Configure system settings

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with 3D effects

## 📁 Project Structure

```
CMS/
├── backend/
│   ├── controllers/      # API logic
│   ├── middleware/       # Auth & role checks
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── package.json
│
└── frontend/
    ├── public/
    └── src/
        ├── components/   # Reusable components
        ├── context/      # Auth context
        ├── pages/        # Page components
        ├── services/     # API services
        ├── App.jsx       # Main app with routes
        ├── index.css     # Premium 3D styles
        └── main.jsx      # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (or use existing folder)

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Environment**

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/cms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

4. **Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start MongoDB** (if using local)
```bash
mongod
```

2. **Start Backend Server**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

3. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `GET /api/auth/profile` - Get logged-in user profile (Protected)

### CMS Content
- `GET /api/cms` - Get all CMS content
- `GET /api/cms/:id` - Get single CMS content
- `POST /api/cms` - Create CMS content (Admin only)
- `PUT /api/cms/:id` - Update CMS content (Admin only)
- `DELETE /api/cms/:id` - Delete CMS content (Admin only)

### User Management
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Reports
- `GET /api/reports` - Generate system reports (Admin only)
- `GET /api/reports/history` - Get report history (Admin only)

### Settings
- `GET /api/settings` - Get all settings (Admin only)
- `PUT /api/settings` - Update/create setting (Admin only)
- `DELETE /api/settings/:key` - Delete setting (Admin only)

## 👥 Default Roles

- **Admin**: Full access to all features
  - Manage users
  - CRUD CMS content
  - View reports
  - Manage settings

- **User**: Limited access
  - View CMS content
  - Access dashboard

## 🎯 Usage

1. **Register**: Create an account (choose Admin or User role)
2. **Login**: Use your credentials to log in
3. **Dashboard**: View system statistics and quick actions
4. **CMS Content**: Browse and manage content
5. **Admin Features**: Access user management, reports, and settings (Admin only)

## 🔐 Security Best Practices

- JWT tokens expire in 7 days
- Passwords are hashed using bcrypt with 10 salt rounds
- Protected routes require valid JWT token
- Admin routes verify user role
- CORS enabled for frontend-backend communication

## 🎨 Design Features

- **Deep Space Theme** - Dark background with vibrant accents
- **Glassmorphism Cards** - Frosted glass effect with backdrop blur
- **3D Hover Effects** - Cards transform in 3D space on hover
- **Animated Particles** - Floating background elements
- **Gradient Buttons** - Eye-catching call-to-action buttons
- **Smooth Transitions** - All interactions are animated

## 📝 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project as a template for your own CMS applications!

## 🌟 Features to Try

1. **Login Animation** - Watch the glassmorphism effects
2. **Dashboard Stats** - See the 3D card animations
3. **CMS Cards** - Hover to see 3D transformations
4. **Particle Background** - Animated floating spheres
5. **Role-Based UI** - Compare Admin vs User interfaces

---

**Built with ❤️ using MERN Stack + Premium 3D Design**
