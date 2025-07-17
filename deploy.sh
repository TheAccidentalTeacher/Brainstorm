#!/bin/bash

echo "🚀 Ultimate Project & Brainstorm Hub - Deployment Helper"
echo "=================================================="

echo ""
echo "📋 Pre-deployment Checklist:"
echo "✅ Cloud databases configured (MongoDB Atlas, Neo4j Aura, Redis Cloud)"
echo "✅ Environment files created"
echo "✅ Deployment configs ready"
echo ""

echo "🎯 Deployment Steps:"
echo ""
echo "1️⃣  DEPLOY BACKEND TO RAILWAY:"
echo "   - Go to: https://railway.app"
echo "   - Click 'Start a new project' → 'Deploy from GitHub repo'"
echo "   - Select your 'Brainstorm' repository"
echo "   - Set root directory: 'src/backend'"
echo "   - Add environment variables from src/backend/.env.production"
echo "   - Deploy and copy the Railway URL"
echo ""

echo "2️⃣  DEPLOY FRONTEND TO VERCEL:"
echo "   - Go to: https://vercel.com"
echo "   - Click 'New Project' → Import 'Brainstorm' repository"
echo "   - Set root directory: 'src/frontend'"
echo "   - Add environment variable: NEXT_PUBLIC_API_URL=<your-railway-url>"
echo "   - Deploy and copy the Vercel URL"
echo ""

echo "3️⃣  UPDATE CONFIGURATION:"
echo "   - Update Railway environment:"
echo "     FRONTEND_URL=<your-vercel-url>"
echo "     CORS_ORIGIN=<your-vercel-url>"
echo "   - Redeploy both services"
echo ""

echo "🔗 Your URLs will be:"
echo "   Frontend: https://your-app-name.vercel.app"
echo "   Backend:  https://your-app-name.railway.app"
echo ""

echo "✨ Ready to deploy!"
