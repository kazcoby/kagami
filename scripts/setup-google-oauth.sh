#!/bin/bash
# Google OAuth Setup Script for MCP Servers
# This script helps set up Gmail, Calendar, and Drive authentication
#
# h(x) ≥ 0 — Always

echo "🪞 Kagami MCP - Google OAuth Setup"
echo "=================================="
echo ""

# Colors
GOLD='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Create the credentials directory
mkdir -p ~/.gmail-mcp
echo -e "${GREEN}✓${NC} Created ~/.gmail-mcp directory"

echo ""
echo "📋 STEP 1: Create Google Cloud Project"
echo "---------------------------------------"
echo "1. Go to: https://console.cloud.google.com/"
echo "2. Click 'Select a project' → 'New Project'"
echo "3. Name it 'Claude Assistant' and create it"
echo ""
read -p "Press Enter when you've created the project..."

echo ""
echo "📋 STEP 2: Enable APIs"
echo "----------------------"
echo "In your project, go to 'APIs & Services' → 'Enable APIs'"
echo "Enable these APIs:"
echo "  - Gmail API"
echo "  - Google Calendar API"
echo "  - Google Drive API"
echo ""
read -p "Press Enter when you've enabled the APIs..."

echo ""
echo "📋 STEP 3: Create OAuth Credentials"
echo "------------------------------------"
echo "1. Go to 'APIs & Services' → 'Credentials'"
echo "2. Click 'Create Credentials' → 'OAuth client ID'"
echo "3. If asked, configure the OAuth consent screen first:"
echo "   - Choose 'External' user type"
echo "   - Add your email as a test user"
echo "4. Select 'Desktop app' as application type"
echo "5. Download the JSON file"
echo ""
read -p "Press Enter when you've downloaded the credentials JSON..."

echo ""
echo "📋 STEP 4: Place the credentials file"
echo "--------------------------------------"
echo "Move or copy your downloaded JSON file to:"
echo "  ~/.gmail-mcp/gcp-oauth.keys.json"
echo ""
echo "Example command:"
echo "  mv ~/Downloads/client_secret_*.json ~/.gmail-mcp/gcp-oauth.keys.json"
echo ""
read -p "Press Enter when you've moved the file..."

# Check if file exists
if [ -f ~/.gmail-mcp/gcp-oauth.keys.json ]; then
    echo -e "${GREEN}✓${NC} Found credentials file!"

    echo ""
    echo "📋 STEP 5: Authenticate with Google"
    echo "------------------------------------"
    echo "Running Gmail authentication..."
    echo ""
    npx @gongrzhe/server-gmail-autoauth-mcp auth

    echo ""
    echo -e "${GOLD}🎉 Setup Complete!${NC}"
    echo ""
    echo "The Seven Colonies can now access your:"
    echo "  ✓ Gmail (read, send, search)"
    echo "  ✓ Google Calendar (schedule, find free time)"
    echo "  ✓ Google Drive (search, read files)"
    echo ""
else
    echo "⚠️  Credentials file not found at ~/.gmail-mcp/gcp-oauth.keys.json"
    echo "Please move the file and run this script again."
    exit 1
fi
