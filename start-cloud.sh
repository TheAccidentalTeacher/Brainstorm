#!/bin/bash

echo "🚀 Ultimate Project & Brainstorm Hub - Development Setup"
echo ""

# Check if .env exists
if [ ! -f "src/backend/.env" ]; then
    echo "⚠️  No .env file found. Creating one from template..."
    cp src/backend/.env.example src/backend/.env
    echo "✅ Created src/backend/.env"
    echo "📝 Please edit src/backend/.env with your cloud database connection strings"
    echo ""
    echo "Need help? Check CLOUD_SETUP.md for detailed instructions"
    echo ""
    read -p "Press Enter after you've updated your .env file..."
fi

echo "🌐 Starting with cloud databases..."
echo ""

# Start frontend and backend only (no local databases)
docker-compose -f docker-compose.cloud.yml up --build

echo ""
echo "🎉 Your app should be running at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
