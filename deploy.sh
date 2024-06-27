#!/bin/bash

# Check if the version number argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <version_number>"
  exit 1
fi

# Get the version number from the command line argument
VERSION=$1

# Define the directory and .env file path
V82_DIR="$HOME/v82"
ENV_FILE="$V82_DIR/.env"

# Check if the .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo ".env file not found in $V82_DIR"
  exit 1
fi

# Replace the TAG value in the .env file
sed -i.bak "s/^TAG=.*/TAG=$VERSION/" "$ENV_FILE"

# Check if the replacement was successful
if grep -q "TAG=$VERSION" "$ENV_FILE"; then
  echo "Successfully updated TAG in .env file to $VERSION"
else
  echo "Failed to update TAG in .env file"
  exit 1
fi

# Change to the v82 directory
cd "$V82_DIR"

# Restart Docker Compose services
docker compose up -d

echo "Docker Compose restart completed"
