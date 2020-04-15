#!/bin/bash

result=$( docker inspect -f '{{.State.Running}}' bc-redis)

if [[ -n "$result" ]]; then
  echo "Redis container is already running"
else
  echo "No such container"
  docker run --name bc-redis -p 6379:6379 -d redis
fi
