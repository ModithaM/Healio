#!/bin/bash

# Healio Docker Image Builder
# Builds all Docker images for microservices and frontend

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         Healio Docker Image Builder${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Configuration
REGISTRY="${DOCKER_REGISTRY:-}"
VERSION="0.0.1-SNAPSHOT"
BUILD_TYPE="${1:-all}"  # all, services, frontend

# Service list
SERVICES=(
  "config-service"
  "discovery-service"
  "auth-service"
  "user-service"
  "patient-service"
  "doctor-service"
  "appointment-service"
  "telemedicine-service"
  "notification-service"
  "symptom-checker-service"
  "gateway"
)

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_FAILED=()
BUILD_SUCCESSFUL=()

# Helper function to build image
build_service() {
  local service=$1
  local dockerfile_path="$PROJECT_ROOT/services/$service"
  local image_name="$service:$VERSION"
  
  if [ -n "$REGISTRY" ]; then
    image_name="$REGISTRY/$image_name"
  fi
  
  echo -e "${YELLOW}Building $service...${NC}"
  
  if docker build -t "$image_name" "$dockerfile_path"; then
    echo -e "${GREEN}✓ $service built successfully${NC}"
    echo -e "  Image: $image_name"
    BUILD_SUCCESSFUL+=("$image_name")
  else
    echo -e "${RED}✗ Failed to build $service${NC}"
    BUILD_FAILED+=("$service")
  fi
  echo ""
}

# Build services
if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "services" ]; then
  echo -e "${BLUE}Building Java Services...${NC}"
  echo ""
  
  for service in "${SERVICES[@]}"; do
    build_service "$service"
  done
fi

# Build frontend
if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "frontend" ]; then
  echo -e "${BLUE}Building Frontend...${NC}"
  echo ""
  
  local frontend_path="$PROJECT_ROOT/client/healio"
  local frontend_image="frontend:$VERSION"
  
  if [ -n "$REGISTRY" ]; then
    frontend_image="$REGISTRY/$frontend_image"
  fi
  
  echo -e "${YELLOW}Building frontend...${NC}"
  
  if docker build -t "$frontend_image" "$frontend_path"; then
    echo -e "${GREEN}✓ frontend built successfully${NC}"
    echo -e "  Image: $frontend_image"
    BUILD_SUCCESSFUL+=("$frontend_image")
  else
    echo -e "${RED}✗ Failed to build frontend${NC}"
    BUILD_FAILED+=("frontend")
  fi
  echo ""
fi

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"

if [ ${#BUILD_FAILED[@]} -eq 0 ]; then
  echo -e "${GREEN}✓ All images built successfully!${NC}"
  echo ""
  echo -e "${BLUE}Built Images:${NC}"
  for image in "${BUILD_SUCCESSFUL[@]}"; do
    echo -e "  ${GREEN}✓${NC} $image"
  done
  echo ""
  
  if [ -n "$REGISTRY" ]; then
    echo -e "${YELLOW}Next step: Push images to registry${NC}"
    echo -e "  $ docker push $REGISTRY/config-service:$VERSION"
    echo -e "  $ ... (repeat for all images)"
  else
    echo -e "${YELLOW}Images are ready for use:${NC}"
    echo -e "  $ docker images | grep $VERSION"
  fi
else
  echo -e "${RED}✗ Build failed for the following:${NC}"
  for service in "${BUILD_FAILED[@]}"; do
    echo -e "  ${RED}✗${NC} $service"
  done
  echo ""
  echo -e "${YELLOW}Successful builds:${NC}"
  for image in "${BUILD_SUCCESSFUL[@]}"; do
    echo -e "  ${GREEN}✓${NC} $image"
  done
  exit 1
fi

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
