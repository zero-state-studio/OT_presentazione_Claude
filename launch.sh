#!/bin/bash
# OT Presentations launcher — starts server and opens browser

cd "$(dirname "$0")"

# Kill any existing process on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Start HTTP server in background
python3 -m http.server 8000 &>/dev/null &

# Wait for server to be ready
sleep 0.5

# Open browser
open http://localhost:8000

echo "Server avviato su http://localhost:8000"
