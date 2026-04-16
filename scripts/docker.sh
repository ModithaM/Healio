#!/bin/bash

# Healio Docker Compose Helper Script
# Usage: ./scripts/docker.sh [command]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_DIR"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Help message
show_help() {
    cat << EOF
${BLUE}Healio Docker Compose Helper${NC}

Usage: ./scripts/docker.sh [command] [service_name]

${GREEN}Commands:${NC}
  up              Start all services in background
  down            Stop all services
  build           Build all service images
  logs            View logs from all services (with -f for follow)
  ps              Show running services
  clean           Stop all services and remove volumes
  rebuild         Rebuild all services
  restart         Restart all services
  
${GREEN}Service-specific commands:${NC}
  up SERVICE      Start specific service (e.g., 'api-gateway')
  down SERVICE    Stop specific service
  logs SERVICE    View logs for specific service
  build SERVICE   Build specific service

${GREEN}Examples:${NC}
  ./scripts/docker.sh up                    # Start all
  ./scripts/docker.sh down                  # Stop all
  ./scripts/docker.sh logs api-gateway      # View gateway logs
  ./scripts/docker.sh build client          # Build client only
  ./scripts/docker.sh rebuild               # Full rebuild
  ./scripts/docker.sh logs -f               # Follow all logs

EOF
}

# Command functions
cmd_up() {
    if [ -z "$1" ]; then
        echo -e "${BLUE}Starting all services...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✓ Services started${NC}"
        docker-compose ps
    else
        echo -e "${BLUE}Starting $1...${NC}"
        docker-compose up -d "$1"
        echo -e "${GREEN}✓ $1 started${NC}"
    fi
}

cmd_down() {
    if [ -z "$1" ]; then
        echo -e "${YELLOW}Stopping all services...${NC}"
        docker-compose down
        echo -e "${GREEN}✓ Services stopped${NC}"
    else
        echo -e "${YELLOW}Stopping $1...${NC}"
        docker-compose stop "$1"
        echo -e "${GREEN}✓ $1 stopped${NC}"
    fi
}

cmd_build() {
    if [ -z "$1" ]; then
        echo -e "${BLUE}Building all services...${NC}"
        docker-compose build
        echo -e "${GREEN}✓ Build complete${NC}"
    else
        echo -e "${BLUE}Building $1...${NC}"
        docker-compose build "$1"
        echo -e "${GREEN}✓ $1 built${NC}"
    fi
}

cmd_logs() {
    FOLLOW=""
    SERVICE=""
    
    if [ "$1" = "-f" ]; then
        FOLLOW="-f"
        SERVICE="$2"
    else
        SERVICE="$1"
    fi
    
    if [ -z "$SERVICE" ]; then
        docker-compose logs $FOLLOW
    else
        docker-compose logs $FOLLOW "$SERVICE"
    fi
}

cmd_ps() {
    docker-compose ps
}

cmd_clean() {
    echo -e "${RED}Cleaning up all services and volumes...${NC}"
    docker-compose down -v
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

cmd_rebuild() {
    echo -e "${BLUE}Rebuilding all services...${NC}"
    docker-compose down -v
    docker-compose build --no-cache
    docker-compose up -d
    echo -e "${GREEN}✓ Rebuild complete${NC}"
    docker-compose ps
}

cmd_restart() {
    echo -e "${YELLOW}Restarting all services...${NC}"
    docker-compose restart
    echo -e "${GREEN}✓ Services restarted${NC}"
    docker-compose ps
}

# Main
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

case "$1" in
    up)
        cmd_up "$2"
        ;;
    down)
        cmd_down "$2"
        ;;
    build)
        cmd_build "$2"
        ;;
    logs)
        cmd_logs "$2" "$3"
        ;;
    ps)
        cmd_ps
        ;;
    clean)
        cmd_clean
        ;;
    rebuild)
        cmd_rebuild
        ;;
    restart)
        cmd_restart
        ;;
    help|-h|--help)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo "Run './scripts/docker.sh help' for usage information"
        exit 1
        ;;
esac
