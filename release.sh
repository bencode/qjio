#!/bin/bash
set -e

name=qijunio
version=`node -pe "require('./package.json').version"`
revision=`git rev-parse --verify HEAD --short`
namespace="registry.qijun.io"
path="${namespace}/${name}"
tag="$version-$revision"
target="$path:$tag"

docker build -t $target .

echo "build success!"
echo $target

#docker push $target
