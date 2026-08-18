# 🚀 Quick Deployment Checklist

## Before You Deploy

### Prerequisites
- [ ] GitHub account with repository pushed
- [ ] Vercel account (free at vercel.com)
- [ ] Render account (free at render.com)
- [ ] MongoDB Atlas account (free tier available)
- [ ] All credentials from `.env` file saved

### Verify Local Build Works
```bash
npm install
npm run build
npm run preview
```

---

## Deployment Order

### 1️⃣ Deploy Backend to Render (FIRST)

**Why first?** You need the backend URL to configure the frontend.

```bash
# Steps:
1. Go to render.com/dashboard
2. Click "+ New" → Web Service
3. Connect GitHub repository
4. Select "citizen-empowerment-grant"
5. Configure:
   - Name: citizen-grant-api
   - Environment: Node.js
   - Build: npm install
   - Start: node --loader tsx src/backend.ts
6. Add Environment Variables (see .env.render file)
7. Click "Create Web Service"
8. Wait 5 minutes for deployment
9. Copy your backend URL (e.g., https://citizen-grant-api.onrender.com)
10. Test: https://citizen-grant-api.onrender.com/api/health
```

### 2️⃣ Deploy Frontend to Vercel (SECOND)

```bash
# Steps:
1. Update .env.production with your Render API URL:
   VITE_API_URL=https://citizen-grant-api.onrender.com

2. Commit and push:
   git add .
   git commit -m "Add production env vars"
   git push

3. Go to vercel.com/dashboard
4. Click "Add New" → Project
5. Import your GitHub repository
6. Configure:
   - Framework: Vite
   - Build: npm run build
   - Output: .output/public
7. Add Environment Variables (see .env.vercel file)
8. Click "Deploy"
9. Wait 3 minutes for deployment
10. Copy your frontend URL (e.g., https://citizen-empowerment-grant.vercel.app)
```

### 3️⃣ Update Backend with Frontend URL

```bash
# On Render Dashboard:
1. Go to citizen-grant-api service
2. Settings → Environment
3. Update these variables:
   - FRONTEND_URL = https://citizen-empowerment-grant.vercel.app
   - CORS_ORIGIN = https://citizen-empowerment-grant.vercel.app
   - APP_URL = https://citizen-empowerment-grant.vercel.app
4. Click "Save Changes"
5. Service will auto-redeploy
```

---

## Environment Variables at a Glance

### Render (Backend)
```
NODE_ENV=production
MONGODB_URI=[your mongodb connection string]
JWT_SECRET=[your jwt secret]
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=[your google client id]
GOOGLE_CLIENT_SECRET=[your google client secret]
EMAIL_USER=[your gmail]
EMAIL_PASSWORD=[your gmail app password]
EMAIL_FROM=support@usfederalgrant.gov
FRONTEND_URL=[your vercel url]
CORS_ORIGIN=[your vercel url]
```

### Vercel (Frontend)
```
VITE_API_URL=[your render backend url]
MONGODB_URI=[your mongodb connection string]
JWT_SECRET=[your jwt secret]
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=[your google client id]
GOOGLE_CLIENT_SECRET=[your google client secret]
EMAIL_USER=[your gmail]
EMAIL_PASSWORD=[your gmail app password]
```

---

## Testing After Deployment

### Backend Tests
```bash
# Health check (should return 200)
curl https://citizen-grant-api.onrender.com/api/health

# Test signup
curl -X POST https://citizen-grant-api.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName":"Test",
    "lastName":"User",
    "email":"test@example.com",
    "password":"TestPassword123"
  }'
```

### Frontend Tests
1. Open `https://citizen-empowerment-grant.vercel.app`
2. Click "Apply Now"
3. Fill signup form
4. Submit
5. Check if you get redirect + reference number
6. Try login with new credentials
7. Access dashboard
8. Select grant package
9. Go to payment page
10. Confirm payment

---

## Troubleshooting

### Backend won't start on Render
- Check Render logs: Dashboard → Service → Logs
- Verify Node.js version (needs 18+)
- Ensure MONGODB_URI is correct
- Check if src/backend.ts exists

### Frontend gives API errors
- Verify VITE_API_URL in Vercel env vars
- Check CORS is enabled on Render
- Test backend health: https://citizen-grant-api.onrender.com/api/health
- Check browser console for specific errors

### Database connection fails
- Verify MongoDB connection string
- Check MongoDB Atlas IP whitelist includes Render
- Test connection locally first

### Emails not sending
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check Gmail app passwords (not regular password)
- Ensure "Less secure apps" allowed if needed

---

## Quick Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Render Logs:** https://dashboard.render.com/services
- **Vercel Logs:** https://vercel.com/dashboard/deployments
- **Your Frontend:** https://citizen-empowerment-grant.vercel.app
- **Your Backend:** https://citizen-grant-api.onrender.com

---

## Files for Deployment

- `vercel.json` - Vercel configuration
- `render.yaml` - Render configuration (optional, can use web UI)
- `.env.render` - Environment template for Render
- `.env.vercel` - Environment template for Vercel
- `.env.production` - Production frontend env vars
- `src/backend.ts` - Standalone backend entry point
- `DEPLOYMENT_GUIDE.md` - Detailed deployment guide

---

## Auto-Deploy Configuration

Both platforms auto-deploy when you push to main/master branch:

```bash
# To trigger deployment
git add .
git commit -m "Your changes"
git push origin main

# Vercel: Deploys in 2-5 minutes
# Render: Deploys in 3-10 minutes
```

---

## Monitoring

### Render Logs
- Real-time API logs
- Error monitoring
- Performance metrics

### Vercel Analytics
- Frontend performance
- Build times
- Deployment history

### MongoDB Atlas
- Database performance
- Query logs
- Backup settings

---

## Next Steps After Deployment

1. ✅ Test all functionality
2. ✅ Monitor logs for errors
3. ✅ Set up custom domain (optional)
4. ✅ Configure email templates
5. ✅ Add analytics
6. ✅ Set up uptime monitoring
7. ✅ Configure auto-backups
8. ✅ Document API endpoints

---

## Support

For issues:
1. Check Render logs
2. Check Vercel logs
3. Check MongoDB connection
4. Review DEPLOYMENT_GUIDE.md
5. Check environment variables
6. Test locally first

Good luck! 🎉
