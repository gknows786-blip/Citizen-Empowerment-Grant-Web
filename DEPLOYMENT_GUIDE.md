# 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend)

## Overview

This guide covers deploying:

- **Frontend**: React + TanStack Start → **Vercel**
- **Backend**: Express + MongoDB → **Render**

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Render Account

1. Go to [render.com](https://render.com)
2. Sign up or log in
3. Create a new account or use existing

### Step 2: Create Database (MongoDB)

Option A: Use Existing MongoDB Atlas

- Your current MongoDB URI: `mongodb+srv://gknows786_db_user:...@cluster0.mhcfhmt.mongodb.net/citizen-grant`
- Keep this connection string for later

Option B: Use Render's PostgreSQL (if switching from MongoDB)

- Skip this if using MongoDB Atlas

### Step 3: Deploy Backend Service

1. **Connect GitHub repository:**
   - Go to Render dashboard → New → Web Service
   - Connect your GitHub account
   - Select the `citizen-empowerment-grant` repository
   - Click "Create Web Service"

2. **Configure Service:**
   - **Name**: `citizen-grant-api`
   - **Environment**: Node.js
   - **Region**: Oregon (or closest to your users)
   - **Build Command**: `npm install`
   - **Start Command**: `node --loader tsx src/backend.ts`
   - **Plan**: Starter (free tier available)

3. **Add Environment Variables:**
   Click "Add Environment Variable" for each:

   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://<your_db_user>:<your_db_password>@cluster0.mongodb.net/citizen-grant?retryWrites=true&w=majority
   JWT_SECRET = <your_jwt_secret_min_32_chars>
   JWT_EXPIRE = 7d
   GOOGLE_CLIENT_ID = <your_google_client_id>.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = <your_google_client_secret>
   EMAIL_USER = <your_email@gmail.com>
   EMAIL_PASSWORD = <your_app_password>
   EMAIL_FROM = support@usfederalgrant.gov
   APP_URL = https://citizen-empowerment-grant.vercel.app
   FRONTEND_URL = https://citizen-empowerment-grant.vercel.app
   CORS_ORIGIN = https://citizen-empowerment-grant.vercel.app
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete (~3-5 minutes)
   - Get your backend URL: `https://citizen-grant-api.onrender.com`

### Step 4: Verify Backend

- Test health endpoint: `https://citizen-grant-api.onrender.com/api/health`
- Should return: `{ "status": "API is running", "timestamp": "...", "environment": "production" }`

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

Before deploying, update your frontend to use the backend API:

1. **Update `src/lib/serverFunctions.ts`:**

   ```typescript
   const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:5000";
   ```

2. **Create `.env.production`:**
   ```
   VITE_API_URL=https://citizen-grant-api.onrender.com
   ```

### Step 2: Prepare Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Import project from GitHub

### Step 3: Deploy to Vercel

1. **Connect GitHub:**
   - Click "Import Project"
   - Search for your repository
   - Click "Import"

2. **Configure Project:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
   - **Install Command**: `npm install`

3. **Add Environment Variables:**
   Click "Add Environment Variable" for each:

   ```
   MONGODB_URI = mongodb+srv://<your_db_user>:<your_db_password>@cluster0.mongodb.net/citizen-grant?retryWrites=true&w=majority
   JWT_SECRET = <your_jwt_secret_min_32_chars>
   JWT_EXPIRE = 7d
   GOOGLE_CLIENT_ID = <your_google_client_id>.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = <your_google_client_secret>
   EMAIL_USER = <your_email@gmail.com>
   EMAIL_PASSWORD = <your_app_password>
   EMAIL_FROM = support@usfederalgrant.gov
   APP_URL = https://citizen-empowerment-grant.vercel.app
   VITE_API_URL = https://citizen-grant-api.onrender.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build (~2-5 minutes)
   - Get your frontend URL (usually `https://citizen-empowerment-grant.vercel.app`)

### Step 4: Verify Frontend

- Open your Vercel URL
- Test signup/login functionality
- Verify API calls reach the Render backend

---

## Step 5: Update Environment Variables After Deployment

Once both services are deployed, update the URLs:

### On Render Dashboard:

1. Go to your API service
2. Settings → Environment Variables
3. Update `FRONTEND_URL` and `CORS_ORIGIN` to your actual Vercel URL

### On Vercel Dashboard:

1. Go to your project settings
2. Environment Variables
3. Update `VITE_API_URL` to your actual Render URL
4. Redeploy

---

## Testing Deployment

### Backend Tests:

```bash
# Health check
curl https://citizen-grant-api.onrender.com/api/health

# Test signup (replace with actual data)
curl -X POST https://citizen-grant-api.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"test@example.com","password":"Password123"}'
```

### Frontend Tests:

1. Visit `https://citizen-empowerment-grant.vercel.app`
2. Test "Apply" page → Fill form → Submit
3. Check if user is created in MongoDB
4. Test "Sign In" with created credentials
5. Verify Dashboard displays user info
6. Test package selection
7. Test payment confirmation

---

## Troubleshooting

### Backend Not Starting

- Check Render logs: Dashboard → Service → Logs
- Verify `MONGODB_URI` is correct
- Ensure `src/backend.ts` exists
- Check Node version: Should be 18+

### Frontend Build Fails

- Check Vercel logs: Project → Deployments → View
- Verify all dependencies in `package.json`
- Check for TypeScript errors: Run `npm run build` locally

### API Calls Failing (CORS)

- Verify `CORS_ORIGIN` on Render backend
- Check that Vercel frontend URL is in `CORS_ORIGIN`
- Browser console should show specific CORS error

### Database Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas network access
- Ensure IP whitelist includes Render servers

---

## Deployment Scripts

### Deploy Backend Only:

```bash
# Render auto-deploys on git push
# To manually trigger:
# 1. Go to Render dashboard
# 2. Click "Deploy"
# 3. Select "Clear build cache & deploy"
```

### Deploy Frontend Only:

```bash
# Vercel auto-deploys on git push
# To manually trigger:
# 1. Go to Vercel dashboard
# 2. Click "Deployments"
# 3. Click "..." and "Redeploy"
```

### Update Both Together:

```bash
git add .
git commit -m "Production deployment"
git push origin main
# Both Vercel and Render will auto-deploy
```

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set on both platforms
- [ ] CORS properly configured
- [ ] Database accessible from Render
- [ ] Email service working (test signup)
- [ ] JWT tokens being generated
- [ ] Login/Logout working
- [ ] Grant package selection working
- [ ] Payment confirmation working
- [ ] SSL/HTTPS working on both
- [ ] Custom domain configured (optional)

---

## Custom Domain (Optional)

### For Render (Backend):

1. Dashboard → Service → Settings
2. Custom Domains
3. Add domain
4. Follow DNS setup instructions

### For Vercel (Frontend):

1. Project Settings → Domains
2. Add custom domain
3. Update DNS settings

---

## Monitoring & Logs

### Render Logs:

- Dashboard → Service Name → Logs
- Real-time logs for debugging

### Vercel Logs:

- Project → Deployments → View
- Click specific deployment for details

---

## Next Steps

1. Push code to GitHub
2. Deploy backend to Render (Step 1)
3. Deploy frontend to Vercel (Step 2)
4. Test both services
5. Monitor logs for errors
6. Update URLs if needed
7. Configure custom domains

Good luck with your deployment! 🚀
