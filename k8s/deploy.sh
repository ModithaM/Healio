#!/bin/bash

# Healio Kubernetes Deployment Script
# Usage: ./deploy.sh [dev|staging|prod]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Healio Kubernetes Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
  echo -e "${RED}Error: Invalid environment '$ENVIRONMENT'${NC}"
  echo "Usage: ./deploy.sh [dev|staging|prod]"
  exit 1
fi

OVERLAY_PATH="$SCRIPT_DIR/k8s/overlays/$ENVIRONMENT"

if [[ ! -d "$OVERLAY_PATH" ]]; then
  echo -e "${RED}Error: Overlay directory not found: $OVERLAY_PATH${NC}"
  exit 1
fi

# Check kubectl
if ! command -v kubectl &> /dev/null; then
  echo -e "${RED}Error: kubectl is not installed${NC}"
  exit 1
fi

echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo ""

# Check if namespace exists
if ! kubectl get namespace healio &> /dev/null; then
  echo -e "${BLUE}Creating healio namespace...${NC}"
  kubectl create namespace healio
fi

# Check secrets before deploying to production
if [[ "$ENVIRONMENT" == "prod" ]]; then
  echo -e "${YELLOW}⚠️  PRODUCTION DEPLOYMENT${NC}"
  echo -e "${YELLOW}Verifying secrets are properly configured...${NC}"
  
  # Check if default secrets exist and warn if using defaults
  SECRET_PASSWORD=$(kubectl get secret healio-secrets -n healio -o jsonpath='{.data.SPRING_DATASOURCE_PASSWORD}' 2>/dev/null || echo "")
  if [[ -z "$SECRET_PASSWORD" ]] || [[ $(echo "$SECRET_PASSWORD" | base64 -d) == "admin" ]]; then
    echo -e "${RED}⚠️  WARNING: Using default database password in production!${NC}"
    echo -e "${RED}    Update k8s/base/secrets.yaml before proceeding${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
  echo ""
fi

# Show deployment plan
echo -e "${BLUE}Deployment Plan:${NC}"
echo "  Overlay: $OVERLAY_PATH"
echo "  Namespace: healio"
echo ""

echo -e "${BLUE}Services to deploy:${NC}"
echo "  Infrastructure: config-service, discovery-service, postgres"
echo "  Core: auth-service, user-service, patient-service, doctor-service"
echo "  Specialty: appointment-service, telemedicine-service, notification-service, symptom-checker-service"
echo "  Frontend: gateway, frontend"
echo ""

# Confirm deployment
read -p "Continue with deployment? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Deployment cancelled"
  exit 0
fi

echo ""
echo -e "${BLUE}Deploying to $ENVIRONMENT environment...${NC}"
echo ""

# Apply kustomization
if command -v kustomize &> /dev/null; then
  echo -e "${BLUE}Using kustomize...${NC}"
  kustomize build "$OVERLAY_PATH" | kubectl apply -f -
else
  echo -e "${BLUE}Using kubectl apply -k...${NC}"
  kubectl apply -k "$OVERLAY_PATH"
fi

echo ""
echo -e "${GREEN}✓ Deployment manifests applied${NC}"
echo ""

# Wait for deployment
echo -e "${BLUE}Waiting for pods to start (this may take a few minutes)...${NC}"
echo ""

# Wait for postgres (StatefulSet)
echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
kubectl rollout status statefulset/postgres -n healio --timeout=5m

# Wait for config-service
echo -e "${YELLOW}Waiting for Config Server...${NC}"
kubectl rollout status deployment/config-service -n healio --timeout=5m

# Wait for discovery-service
echo -e "${YELLOW}Waiting for Discovery Service...${NC}"
kubectl rollout status deployment/discovery-service -n healio --timeout=5m

# Wait for other services
echo -e "${YELLOW}Waiting for core services...${NC}"
kubectl rollout status deployment/auth-service -n healio --timeout=5m

echo ""
echo -e "${GREEN}✓ Deployment completed${NC}"
echo ""

# Show status
echo -e "${BLUE}Deployment Status:${NC}"
echo ""
kubectl get all -n healio

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo ""

if [[ "$ENVIRONMENT" == "dev" ]]; then
  echo "1. Port forward to test services:"
  echo "   kubectl port-forward -n healio svc/gateway 8080:8080"
  echo "   kubectl port-forward -n healio svc/frontend 3000:3000"
  echo "   kubectl port-forward -n healio svc/discovery-service 8761:8761"
  echo ""
  echo "2. Check logs:"
  echo "   kubectl logs -n healio -l app=gateway -f"
  echo "   kubectl logs -n healio -l app=auth-service -f"
  echo ""
  echo "3. View Eureka UI:"
  echo "   kubectl port-forward -n healio svc/discovery-service 8761:8761"
  echo "   Open http://localhost:8761"
fi

echo ""
echo "4. Check pod status:"
echo "   kubectl get pods -n healio -w"
echo ""
echo "5. View detailed info:"
echo "   kubectl describe pod <pod-name> -n healio"
echo ""

echo -e "${GREEN}Deployment ready!${NC}"
