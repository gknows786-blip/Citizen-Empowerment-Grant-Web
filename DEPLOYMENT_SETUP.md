# 📦 Deployment Files & Configuration Summary

## Overview
All files needed for Vercel + Render deployment are now included in the project.

---

## New Deployment Files Created

### 1. **Backend Entry Point**
📄 `src/backend.ts`
- Standalone Express server for Render
- Connects to MongoDB
- Sets up CORS
- Mounts API routes (/auth, /grants)
- Health check endpoint
- **Used by Render start command:** `node --loader tsx src/backend.ts`

### 2. **Platform Configuration Files**

#### For Vercel (Frontend)
📄 `vercel.json`
- Build configuration for Vercel
- Specifies output directory: `.output/public`
- Declares required environment variables
- Framework: Vite
- Region: iad1 (US)

#### For Render (Backend)
📄 `render.yaml`
- Infrastructure as Code for Render
- Defines service: Node.js web service
- Database configuration
- Health check endpoint
- Auto-deploy settings
- Environment variables declaration

### 3. **Environment Variable Templates**

#### `.env.render` (for Render backend)
Contains all backend environment variables:
- Node.js config (NODE_ENV, PORT)
- Database (MONGODB_URI)
- Authentication (JWT_SECRET, JWT_EXPIRE)
- OAuth (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- Email (EMAIL_USER, EMAIL_PASSWORD)
- URLs (APP_URL, FRONTEND_URL, CORS_ORIGIN)

#### `.env.vercel` (for Vercel frontend)
Contains frontend-specific environment variables:
- Database connection string (for server functions)
- JWT secrets
- Email service credentials
- URLs (APP_URL, VITE_API_URL)
- OAuth credentials

#### `.env.production`
Frontend production environment:
- VITE_API_URL pointing to Render backend
- Used during Vercel build and runtime

### 4. **Updated Configuration Files**

#### `package.json` (scripts added)
New npm scripts for deployment:
```json
{
  "start:backend": "node --loader tsx src/backend.ts",
  "start:frontend": "vite preview"
}
```

#### `.gitignore` (enhanced)
Added to prevent committing sensitive data:
```
.env
.env.local
.env.render
.env.vercel
.env.*.local
```

### 5. **Documentation Files**

#### `DEPLOYMENT_GUIDE.md` (comprehensive)
- Step-by-step deployment instructions
- Configuration details for each platform
- Environment variable setup
- Testing procedures
- Troubleshooting guide
- Monitoring & logs

#### `DEPLOYMENT_CHECKLIST.md` (quick reference)
- Deployment order (backend → frontend)
- Quick links
- Environment variable summary
- Testing checklist
- Common issues & solutions

---

## File Structure for Deployment

```
citizen-empowerment-grant/
├── src/
│   ├── api/
│   │   ├── auth.ts           (Render uses this)
│   │   ├── grants.ts         (Render uses this)
│   │   └── index.ts          (Dev reference)
│   ├── backend.ts            ✨ NEW - Render entry point
│   ├── server.ts             (Vercel uses this for SSR)
│   ├── lib/
│   │   ├── serverFunctions.ts (API integration)
│   │   ├── authUtils.ts      (JWT, token generation)
│   │   ├── emailService.ts   (Nodemailer)
│   │   └── ...
│   ├── routes/
│   │   ├── index.tsx         (Landing page)
│   │   ├── apply.tsx         (Signup/Signin)
│   │   ├── dashboard.tsx     (User dashboard)
│   │   └── ...
│   └── components/
│       ├── SiteLayout.tsx    (Main layout)
│       └── ui/               (Shadcn components)
├── package.json              (Updated with scripts)
├── vite.config.ts            (Vercel uses this)
├── vercel.json              ✨ NEW - Vercel config
├── render.yaml              ✨ NEW - Render config
├── .env.render              ✨ NEW - Render env template
├── .env.vercel              ✨ NEW - Vercel env template
├── .env.production          ✨ NEW - Production env
├── .gitignore               (Updated)
├── DEPLOYMENT_GUIDE.md      ✨ NEW - Detailed guide
├── DEPLOYMENT_CHECKLIST.md  ✨ NEW - Quick reference
└── README.md                (Original)
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│              (your project code pushed here)             │
└────────────────┬──────────────────────────┬──────────────┘
                 │                          │
                 ▼                          ▼
        ┌─────────────────┐      ┌─────────────────────┐
        │ Render (Backend)│      │ Vercel (Frontend)   │
        ├─────────────────┤      ├─────────────────────┤
        │ Express API     │      │ React App           │
        │ Node.js         │      │ TanStack Start      │
        │ MongoDB Connect │      │ Vite Build          │
        │ Port: 5000      │      │ Deploy to CDN       │
        │ URL: *.onrender │      │ URL: *.vercel.app   │
        └────────┬────────┘      └──────────┬──────────┘
                 │                          │
                 └──────────┬───────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ MongoDB Atlas │
                    │   Database    │
                    └───────────────┘
```

---

## Environment Variables Summary

### Variables Used in Both
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token encryption
- `JWT_EXPIRE` - Token expiration (7d)
- `GOOGLE_CLIENT_ID` - OAuth
- `GOOGLE_CLIENT_SECRET` - OAuth
- `EMAIL_USER` - Gmail account
- `EMAIL_PASSWORD` - Gmail app password
- `EMAIL_FROM` - Sender email
- `APP_URL` - Application URL

### Backend (Render) Only
- `NODE_ENV` - Environment (production)
- `PORT` - Server port (5000)
- `FRONTEND_URL` - Frontend origin for CORS
- `CORS_ORIGIN` - CORS whitelist

### Frontend (Vercel) Only
- `VITE_API_URL` - Backend API base URL

---

## Deployment Flow

### First Time Setup
1. Create GitHub repository
2. Push code with all deployment files
3. Create Render account & connect GitHub
4. Deploy backend to Render
5. Get backend URL
6. Create Vercel account & connect GitHub
7. Deploy frontend to Vercel
8. Update Render backend with frontend URL
9. Test both services

### Auto-Deploy After Setup
```
git push origin main
         ↓
GitHub receives push
         ├─→ Render detects push
         │   ├─→ Build backend (2-3 min)
         │   └─→ Deploy to production
         │
         └─→ Vercel detects push
             ├─→ Build frontend (1-2 min)
             └─→ Deploy to CDN
```

---

## Quick Setup Commands

### Local Development
```bash
# Install dependencies
npm install

# Development server (frontend + backend)
npm run dev

# Build frontend only
npm run build

# Test backend locally
npm run start:backend
```

### Deployment
```bash
# Commit and push (triggers auto-deploy)
git add .
git commit -m "Deploy to production"
git push origin main

# Verify deployments
# Render: https://dashboard.render.com
# Vercel: https://vercel.com/dashboard
```

---

## Critical Environment Variables

These MUST be set on both platforms:
- ✅ `MONGODB_URI` - Without this, database won't connect
- ✅ `JWT_SECRET` - Without this, authentication fails
- ✅ `EMAIL_USER` & `EMAIL_PASSWORD` - Without these, emails don't send
- ✅ `VITE_API_URL` (Vercel) - Points to backend
- ✅ `FRONTEND_URL` (Render) - For CORS

---

## Deployment Checklist

### Before Deploying
- [ ] Code pushed to GitHub
- [ ] All environment variables prepared
- [ ] MongoDB Atlas connection string ready
- [ ] Gmail app password created
- [ ] Google OAuth credentials ready
- [ ] Render account created
- [ ] Vercel account created

### During Deployment
- [ ] Deploy backend to Render first
- [ ] Get backend URL from Render
- [ ] Deploy frontend to Vercel
- [ ] Update Render backend URL
- [ ] Update Vercel frontend URL

### After Deployment
- [ ] Test backend health endpoint
- [ ] Test frontend signup
- [ ] Test login
- [ ] Test email sending
- [ ] Test database operations
- [ ] Check logs for errors

---

## Support & Troubleshooting

See `DEPLOYMENT_GUIDE.md` for:
- Detailed step-by-step instructions
- Troubleshooting specific errors
- Testing procedures
- Monitoring setup

See `DEPLOYMENT_CHECKLIST.md` for:
- Quick reference checklist
- Common issues
- Quick links
- Environment variable summary

---

## Key Takeaways

1. **Backend is separate** (`src/backend.ts`) - allows independent Render deployment
2. **Frontend uses TanStack Start** - Vercel handles the build
3. **Environment variables** - Must be set on each platform
4. **Auto-deploy enabled** - Push to GitHub triggers both platforms
5. **CORS configured** - Backend allows requests from frontend
6. **Health check available** - Test backend at `/api/health`

---

## What's Deployed Where

| Component | Platform | URL Pattern |
|-----------|----------|------------|
| Frontend (React) | Vercel | `*.vercel.app` |
| Backend API | Render | `*.onrender.com` |
| Database | MongoDB Atlas | `*.mongodb.net` |
| Code Repository | GitHub | `github.com/...` |

---

## Next Steps

1. **Review DEPLOYMENT_CHECKLIST.md** - Follow step-by-step
2. **Push code to GitHub** - With all deployment files
3. **Deploy backend to Render** - Set environment variables
4. **Deploy frontend to Vercel** - Set environment variables
5. **Test both services** - Check health endpoints
6. **Monitor logs** - Watch for any issues

Good luck with deployment! 🚀
