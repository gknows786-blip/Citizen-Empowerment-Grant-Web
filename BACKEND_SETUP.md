# Backend Setup Instructions

## 📋 What Has Been Created

### Backend Structure:
```
src/
├── api/
│   ├── index.ts          # Main Express app setup & MongoDB connection
│   ├── auth.ts           # Authentication routes (signup, signin, forgot password, reset password)
│   └── grants.ts         # Grant package selection & payment confirmation routes
├── models/
│   └── User.ts           # MongoDB User schema with password hashing
├── lib/
│   ├── authUtils.ts      # JWT token generation & verification
│   └── emailService.ts   # Nodemailer setup & email templates
```

### API Endpoints Created:

#### Authentication Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/profile` - Get user profile (requires JWT token)

#### Grant Endpoints:
- `GET /api/grants/packages` - Get available grant packages
- `POST /api/grants/select-package` - Select a grant package (requires JWT token)
- `POST /api/grants/confirm-payment` - Confirm payment (requires JWT token)
- `GET /api/grants/dashboard` - Get user dashboard data (requires JWT token)

#### Health Check:
- `GET /api/health` - API health status

## 🔐 What You Need to Provide

### 1. MongoDB Atlas Connection String
**Where to get it:**
- Go to https://www.mongodb.com/cloud/atlas (create account if needed)
- Create a new cluster
- Click "Connect" → "Drivers" → Copy the connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/citizen-grant?retryWrites=true&w=majority`

### 2. Google OAuth Credentials (for future Google Sign-In)
**Where to get them:**
- Go to https://console.cloud.google.com
- Create a new project
- Enable Google+ API
- Create OAuth 2.0 credentials (Web application)
- Get Client ID and Client Secret

### 3. Gmail App Password (for Nodemailer)
**Where to get it:**
- Use a Gmail account for testing
- Enable 2-factor authentication on your Google account
- Go to https://myaccount.google.com/apppasswords
- Generate an App Password for "Mail" and "Windows Computer"
- Copy the 16-character password

## 📝 How to Set Up Environment Variables

1. **Copy the .env.example file to .env:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in the .env file with your credentials:**
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/citizen-grant?retryWrites=true&w=majority
   JWT_SECRET=create_your_own_random_secret_key_here_minimum_32_chars
   JWT_EXPIRE=7d
   
   GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5173/api/auth/google/callback
   
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=support@usfederalgrant.gov
   
   NODE_ENV=development
   APP_URL=http://localhost:5173
   API_URL=http://localhost:5173/api
   ```

## 🚀 Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```
   (If npm has issues, try: `node -e "require('child_process').spawnSync('npm', ['install'], {stdio: 'inherit'})"`)

2. **Create .env file** with your credentials (see above)

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   - Health check: `http://localhost:5173/api/health`

## 📧 Email Templates Included

The system automatically sends emails for:
1. **Sign-up Confirmation** - Welcome message with reference number
2. **Package Selection** - Payment instructions with deadline
3. **Payment Confirmation** - Grant delivery update
4. **Password Reset** - Password reset link

## 🔑 Authentication Flow

1. User signs up → Email sent with ref number
2. User is issued JWT token
3. Token stored in localStorage on frontend
4. All protected routes require `Authorization: Bearer <token>` header
5. Token expires after 7 days

## 📊 Database Schema

The User model includes:
- Personal info (name, email, phone, DOB, age)
- Address (street, city, state/province, zip, country)
- Grant info (selected package, amount, fee, payment status)
- Authentication (password, googleId, emailVerified)
- Metadata (refNumber, timestamps)

## ✅ Next Steps

1. **Provide the three credentials** (MongoDB URI, Google OAuth, Gmail App Password)
2. **Create .env file** with the credentials
3. **Run `npm install`** to install packages
4. **Test the API** with Postman or similar tool
5. **Then we'll build the frontend** to consume these APIs

---

**Need help?** Let me know the three credentials and I'll verify everything is working!
