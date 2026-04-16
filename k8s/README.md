# Kubernetes Quick Reference - Healio

## Quick Deploy

```bash
# Development
./k8s/deploy.sh dev

# Staging
./k8s/deploy.sh staging

# Production
./k8s/deploy.sh prod
```

## Quick Commands

### View Status

```bash
# All resources
kubectl get all -n healio

# Just pods
kubectl get pods -n healio

# Watch pods
kubectl get pods -n healio -w

# By service
kubectl get pods -n healio -l app=auth-service
```

### View Logs

```bash
# Single pod
kubectl logs -n healio <pod-name>

# Follow logs
kubectl logs -n healio <pod-name> -f

# All pods for service
kubectl logs -n healio -l app=auth-service --all-containers=true

# Previous pod logs (for crashes)
kubectl logs -n healio <pod-name> --previous
```

### Port Forwarding

```bash
# API Gateway (8080)
kubectl port-forward -n healio svc/gateway 8080:8080

# Frontend (3000)
kubectl port-forward -n healio svc/frontend 3000:3000

# Eureka UI (8761)
kubectl port-forward -n healio svc/discovery-service 8761:8761

# Config Server (8888)
kubectl port-forward -n healio svc/config-service 8888:8888

# PostgreSQL (5432)
kubectl port-forward -n healio svc/postgres 5432:5432
```

### Scale Services

```bash
# Scale to specific replicas
kubectl scale deployment auth-service -n healio --replicas=5

# View current replicas
kubectl get deployment -n healio
```

### Restart Services

```bash
# Restart single service
kubectl rollout restart deployment/auth-service -n healio

# Restart all services
kubectl rollout restart deployment -n healio

# Watch rollout
kubectl rollout status deployment/auth-service -n healio
```

### Update Configs

```bash
# Edit ConfigMap
kubectl edit configmap healio-config -n healio

# Edit Secrets
kubectl edit secret healio-secrets -n healio

# Reapply deployment
kubectl apply -k k8s/overlays/dev/
```

### Database

```bash
# Connect to PostgreSQL
kubectl exec -it postgres-0 -n healio -- psql -U admin -d healio

# Backup database
kubectl exec postgres-0 -n healio -- pg_dump -U admin healio > backup.sql

# View logs
kubectl logs -n healio postgres-0
```

### Troubleshooting

```bash
# Describe pod (shows events, errors)
kubectl describe pod <pod-name> -n healio

# Check resource usage
kubectl top pods -n healio

# Get resource info
kubectl get pods -n healio -o json | jq '.items[] | {name: .metadata.name, containers: .spec.containers[] | {name, resources}}'

# Check events
kubectl get events -n healio

# Explain resource
kubectl explain deployment.spec.template.spec
```

### Advanced

```bash
# SSH into pod
kubectl exec -it <pod-name> -n healio -- /bin/sh

# Copy file from pod
kubectl cp healio/<pod-name>:/path/to/file ./local-file

# Apply YAML directly
kubectl apply -f deployment.yaml -n healio

# Dry run
kubectl apply -k k8s/overlays/dev/ --dry-run=client -o yaml

# Get detailed YAML
kubectl get deployment auth-service -n healio -o yaml

# Delete resources
kubectl delete pod <pod-name> -n healio
kubectl delete deployment auth-service -n healio
```

## Environment Replicas

| Service | Dev | Staging | Prod |
|---------|-----|---------|------|
| config-service | 1 | 2 | 3 |
| discovery-service | 1 | 2 | 3 |
| gateway | 1 | 2 | 3 |
| frontend | 1 | 2 | 3 |
| auth-service | 1 | 2 | 3 |
| user-service | 1 | 2 | 3 |
| patient-service | 1 | 2 | 3 |
| doctor-service | 1 | 2 | 3 |
| appointment-service | 1 | 2 | 3 |
| telemedicine-service | 1 | 2 | 3 |
| notification-service | 1 | 2 | 3 |
| symptom-checker-service | 1 | 2 | 3 |

## Common Issues

### Pods pending

```bash
# Check why pod is pending
kubectl describe pod <pod-name> -n healio

# Usually: PVC not bound, insufficient resources, node not ready
```

### CrashLoopBackOff

```bash
# Check logs
kubectl logs -n healio <pod-name> --previous

# Check events
kubectl describe pod <pod-name> -n healio
```

### Service not discovered

```bash
# Check Eureka registration
kubectl logs -n healio -l app=discovery-service

# Check if service can reach config server
kubectl exec -it <service-pod> -n healio -- curl http://config-service:8888/actuator/health
```

### Database connection error

```bash
# Check PostgreSQL pod
kubectl get pods -n healio -l app=postgres

# Check PostgreSQL logs
kubectl logs -n healio postgres-0

# Test connection
kubectl exec -it postgres-0 -n healio -- psql -U admin -d healio -c "SELECT 1"
```

## Health Checks

### Direct API calls

```bash
# Gateway health
curl http://localhost:8080/actuator/health

# Config Server health
curl http://localhost:8888/actuator/health

# Discovery Service health
curl http://localhost:8761/actuator/health

# Individual service (if port forwarded)
kubectl port-forward svc/auth-service 8080:8080
curl http://localhost:8080/actuator/health
```

### Service Discovery

```bash
# Port forward to Eureka
kubectl port-forward svc/discovery-service 8761:8761

# Access Eureka UI
open http://localhost:8761

# Check registered services
curl http://localhost:8761/eureka/apps
```

## File Locations

| Item | Location |
|------|----------|
| Namespace & base configs | `k8s/base/` |
| Service deployments | `k8s/services/{service}` |
| Database config | `k8s/database/` |
| Frontend config | `k8s/frontend/` |
| Dev overlay | `k8s/overlays/dev/` |
| Staging overlay | `k8s/overlays/staging/` |
| Prod overlay | `k8s/overlays/prod/` |
| HPA configs | `k8s/monitoring/hpa.yaml` |
| Deploy script | `k8s/deploy.sh` |
| Documentation | `k8s/README.md` |

## Useful Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Kustomize Documentation](https://kustomize.io/)
- [Spring Cloud on Kubernetes](https://spring.io/projects/spring-cloud-kubernetes)
