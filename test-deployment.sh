#!/bin/bash

echo "🚀 TESTING FULL STACK DEPLOYMENT"
echo "================================"

# Test backend health
echo "1. Testing Backend API..."
BACKEND_URL="https://brainstorm-production-fdab.up.railway.app"

echo "   - Testing root endpoint..."
ROOT_RESPONSE=$(curl -s "$BACKEND_URL/")
if [[ "$ROOT_RESPONSE" == *"Ultimate Project & Brainstorm Hub API"* ]]; then
    echo "   ✅ Backend root endpoint working"
else
    echo "   ❌ Backend root endpoint failed"
    echo "   Response: $ROOT_RESPONSE"
fi

echo "   - Testing auth endpoint..."
AUTH_RESPONSE=$(curl -s "$BACKEND_URL/api/auth/me")
if [[ "$AUTH_RESPONSE" == *"No token provided"* ]]; then
    echo "   ✅ Auth endpoint working"
else
    echo "   ❌ Auth endpoint failed"
    echo "   Response: $AUTH_RESPONSE"
fi

echo "   - Testing projects endpoint..."
PROJECTS_RESPONSE=$(curl -s "$BACKEND_URL/api/projects")
if [[ "$PROJECTS_RESPONSE" == *"No token provided"* ]]; then
    echo "   ✅ Projects endpoint working"
else
    echo "   ❌ Projects endpoint failed"
    echo "   Response: $PROJECTS_RESPONSE"
fi

# Test frontend
echo ""
echo "2. Testing Frontend..."
FRONTEND_URL="https://brainstorm-git-main-theaccidentalteachers-projects.vercel.app"

echo "   - Testing frontend accessibility..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [[ "$FRONTEND_RESPONSE" == "200" ]]; then
    echo "   ✅ Frontend accessible"
else
    echo "   ❌ Frontend not accessible (HTTP $FRONTEND_RESPONSE)"
fi

echo ""
echo "🎉 TEST COMPLETE"
echo "Backend API: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
