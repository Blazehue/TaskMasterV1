# TaskMaster Pro - Vercel Deployment Guide

## Prerequisites

1. **GitHub Account**: Your project is already on GitHub at https://github.com/Blazehue/TaskMasterPro
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Turso Database**: Ensure your Turso database is set up and accessible

## Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `Blazehue/TaskMasterPro`
4. Vercel will automatically detect it's a Next.js project

## Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
TURSO_CONNECTION_URL=your_actual_turso_connection_url
TURSO_AUTH_TOKEN=your_actual_turso_auth_token
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=https://your-project-name.vercel.app
```

## Step 3: Deploy

1. Click "Deploy" in Vercel
2. Vercel will automatically:
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to production

## Step 4: Verify Deployment

1. Check that your app loads correctly
2. Test database connections
3. Verify all API endpoints work

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that environment variables are set correctly
- Verify database connectivity

### Database Issues
- Confirm Turso database is accessible from Vercel's servers
- Check environment variable names match exactly
- Ensure database schema is properly migrated

### Performance
- Monitor Vercel Analytics for performance insights
- Check function execution times in Vercel dashboard

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` environment variable

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_CONNECTION_URL` | Turso database connection string | Yes |
| `TURSO_AUTH_TOKEN` | Turso authentication token | Yes |
| `NEXTAUTH_SECRET` | Random string for NextAuth | Yes |
| `NEXTAUTH_URL` | Your app's public URL | Yes |

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Turso Documentation](https://docs.turso.tech/)

