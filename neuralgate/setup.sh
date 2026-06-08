#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  ◈ NeuralGate — Full-Stack AI Platform Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# ── Check prerequisites ──────────────────────────────────────────────────────
echo -e "\n${YELLOW}[1/5] Checking prerequisites…${NC}"

if ! command -v python3 &>/dev/null; then
  echo -e "${RED}✗ Python 3 not found. Install from https://python.org${NC}"; exit 1
fi
echo -e "${GREEN}✓ Python $(python3 --version)${NC}"

if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"; exit 1
fi
echo -e "${GREEN}✓ Node $(node --version)${NC}"

if ! command -v mongod &>/dev/null && ! pgrep -x mongod &>/dev/null; then
  echo -e "${YELLOW}⚠ MongoDB not running. Attempting to start via Homebrew…${NC}"
  if command -v brew &>/dev/null; then
    brew services start mongodb-community 2>/dev/null || true
    sleep 2
  else
    echo -e "${RED}✗ MongoDB not found. Install: brew install mongodb-community${NC}"
    echo "   Or download from https://www.mongodb.com/try/download/community"
    exit 1
  fi
fi
echo -e "${GREEN}✓ MongoDB ready${NC}"

# ── Backend setup ────────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/5] Setting up Python backend…${NC}"
cd backend

python3 -m venv venv
source venv/bin/activate

pip install -q -r requirements.txt
echo -e "${GREEN}✓ Python dependencies installed${NC}"

deactivate
cd ..

# ── Frontend setup ───────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[3/5] Installing Node.js frontend dependencies…${NC}"
cd frontend
npm install --silent
echo -e "${GREEN}✓ npm packages installed${NC}"
cd ..

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Run the app:  ./start.sh"
echo ""
