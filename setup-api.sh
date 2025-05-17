#!/bin/bash

# Add API configuration to .env file
echo "

# API Configuration
API_PORT=3001
API_SECRET=$(openssl rand -hex 32)
DASHBOARD_PASSWORD=$(openssl rand -base64 12)" >> .env

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Start the API server
pnpm run api 