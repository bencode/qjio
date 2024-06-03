#!/bin/bash
set -e

# Use jq to parse package.json
name=$(jq -r '.name' ./package.json)
version=$(jq -r '.version' ./package.json)
revision=$(git rev-parse --verify HEAD --short)
namespace="registry.ffcp.io"
path="${namespace}/${name}"
tag="$version-$revision"
target="$path:$tag"

docker build -t $target .

echo "build success!"
echo $target

# Uncomment to push the image
# docker push $target
