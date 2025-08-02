#!/bin/bash

echo "Testing title generation workflow..."

# Create a new conversation
echo "1. Creating new conversation..."
CONV_RESPONSE=$(curl -s -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title": "New Chat", "model": "llama3.2:1b"}')

CONV_ID=$(echo $CONV_RESPONSE | sed 's/.*"id":"\([^"]*\)".*/\1/')
echo "Created conversation: $CONV_ID"

# Send first message to trigger title generation
echo "2. Sending first message..."
MESSAGE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "'$CONV_ID'", "role": "user", "content": "Help me write a Python script to analyze stock market data"}')

echo "Message sent: $(echo $MESSAGE_RESPONSE | sed 's/.*"content":"\([^"]*\)".*/\1/')"

# Wait a moment for title generation
echo "3. Waiting for title generation (5 seconds)..."
sleep 5

# Check if title was updated
echo "4. Checking updated conversation..."
UPDATED_CONV=$(curl -s http://localhost:3001/api/conversations/$CONV_ID)
NEW_TITLE=$(echo $UPDATED_CONV | sed 's/.*"title":"\([^"]*\)".*/\1/')

echo "Updated title: $NEW_TITLE"

if [ "$NEW_TITLE" != "New Chat" ]; then
  echo "✅ SUCCESS: Title was automatically generated!"
else
  echo "❌ FAILED: Title was not updated"
fi
