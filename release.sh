#!/bin/bash

# Remote server and directory
REMOTE_SERVER="root@qijun.io"
REMOTE_REPO_DIR="~/repos/qjio"

# SSH into the remote server and execute commands
ssh $REMOTE_SERVER << 'EOF'
  cd ~/repos/qjio
  git pull
  ./build.sh
EOF

# Get the output of the remote commands and extract the version number
OUTPUT=$(ssh $REMOTE_SERVER << 'EOF'
  cd ~/repos/qjio
  ./build.sh
EOF
)

# Extract the version number
VERSION=$(echo "$OUTPUT" | grep -o 'registry.qijun.io/qjio:[^ ]*' | cut -d':' -f2)

# Check if the version number was successfully extracted
if [ -z "$VERSION" ]; then
  echo "Failed to extract version number"
  exit 1
fi

# Print the extracted version number
echo "Extracted version number: $VERSION"

# Get the local home directory
LOCAL_HOME_DIR=$(eval echo ~)

# Define the local .env file path
ENV_FILE="$LOCAL_HOME_DIR/v82/.env"

# Replace the TAG value in the local .env file
sed -i.bak "s/^TAG=.*/TAG=$VERSION/" "$ENV_FILE"

# Check if the replacement was successful
if grep -q "TAG=$VERSION" "$ENV_FILE"; then
  echo "Successfully updated TAG in .env file"
else
  echo "Failed to update TAG in .env file"
  exit 1
fi

# Restart Docker Compose services
cd "$LOCAL_HOME_DIR/v82"
docker compose up -d

echo "Docker Compose restart completed"
