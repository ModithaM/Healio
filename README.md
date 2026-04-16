# Healio

**AI-Enabled Smart Healthcare Appointment & Telemedicine Platform**

A microservices-based platform that leverages AI to streamline healthcare appointments and telemedicine services, connecting patients with doctors through a scalable and modular architecture.

**Tech Stack:** Spring Boot (Backend Services) | Next.js (Frontend) | pnpm (Package Manager)

---

## Services

All backend services are implemented using **Spring Boot** microservices architecture.

| Service | Description |
|---|---|
| **config-service** | Centralized configuration server (Spring Cloud Config) — manages externalized configuration for all microservices |
| **discovery-service** | Service Registry (Eureka) — enables dynamic service discovery and registration |
| **gateway** | API Gateway (Spring Cloud Gateway) — single entry point that routes client requests to the appropriate microservices |
| **auth-service** | Authentication & authorization service — handles user authentication, JWT tokens, and access control |
| **user-service** | User management — manages user profiles, roles, and account settings |
| **patient-service** | Manages patient profiles, registration, medical history, and patient-related data |
| **doctor-service** | Handles doctor profiles, specializations, availability, and scheduling preferences |
| **appointment-service** | Manages booking, cancellation, and tracking of healthcare appointments |
| **telemedicine-service** | Enables virtual consultations, video sessions, and remote care between patients and doctors |

---

## Project Structure

```
Healio/
├── client/                      # Frontend application
├── services/
│   ├── config-service/          # Configuration server (Spring Cloud Config)
│   ├── discovery-service/       # Eureka service registry (Spring Cloud)
│   ├── gateway/                 # API Gateway (Spring Cloud Gateway)
│   ├── auth-service/            # Authentication service (Spring Boot)
│   ├── user-service/            # User management service (Spring Boot)
│   ├── patient-service/         # Patient management service (Spring Boot)
│   ├── doctor-service/          # Doctor management service (Spring Boot)
│   ├── appointment-service/     # Appointment management service (Spring Boot)
│   └── telemedicine-service/    # Telemedicine service (Spring Boot)
├── infra/                       # Infrastructure configuration (Docker, K8s, etc.)
├── config/                      # Configuration files for services
├── scripts/                     # Automation and deployment scripts
├── package.json                 # Root project configuration
├── pom.xml                      # Maven parent POM for all services
└── README.md
```

---

## Getting Started

### Prerequisites
- **Java 17+** (for Spring Boot services)
- **Maven 3.8+** (for building services)
- **Node.js 18+** and **pnpm** (for frontend development and package management)

### Environment Setup

Before starting the project, create environment files from the provided samples:

#### Root environment:
```bash
cp sample.env .env
```

#### Client environment:
```bash
cp client/healio/sample.env.local client/healio/.env.local
```

Edit these files with your actual configuration values.

PayPal sandbox setup for appointments requires:
- `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in root `.env` (used by `appointment-service`)
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` in `client/healio/.env.local` (used by patient dashboard PayPal checkout UI)

### Installation & Build

#### Install all dependencies (services and client):
```bash
pnpm run dependency
```

This command installs both backend service dependencies (Maven) and frontend dependencies (pnpm).

#### Build all Spring Boot services:
```bash
pnpm run build
```

#### Run all services:
```bash
pnpm run start
```

#### Run services in development mode (with hot reload):
```bash
pnpm run dev
```

#### Stop all running services:
```bash
pnpm run stop
```

#### Run tests:
```bash
pnpm run test
```

### Individual Service Commands

Each service has its own `pom.xml`. To work with individual services:

```bash
cd services/<service-name>
mvn clean install          # Build the service
mvn spring-boot:run        # Run the service
mvn test                   # Run tests
```

---

## Development

### Frontend
Navigate to the `client/` directory for frontend development guidelines.

### Backend Services
Each Spring Boot service runs independently and communicates via REST APIs through the API Gateway. Services register themselves with the discovery service for dynamic routing.

---

## License
ISC
