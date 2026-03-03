# Healio

**AI-Enabled Smart Healthcare Appointment & Telemedicine Platform**

A microservices-based platform that leverages AI to streamline healthcare appointments and telemedicine services, connecting patients with doctors through a scalable and modular architecture.

---

## Services

| Service | Description |
|---|---|
| **gateway** | API Gateway — single entry point that routes client requests to the appropriate microservices |
| **patient-service** | Manages patient profiles, registration, medical history, and patient-related data |
| **doctor-service** | Handles doctor profiles, specializations, availability, and scheduling preferences |
| **appointment-service** | Manages booking, cancellation, and tracking of healthcare appointments |
| **telemedicine-service** | Enables virtual consultations, video sessions, and remote care between patients and doctors |

---

## Project Structure

```
Healio/
├── client/          # Frontend application
├── services/
│   ├── gateway/
│   ├── patient-service/
│   ├── doctor-service/
│   ├── appointment-service/
│   └── telemedicine-service/
└── infra/           # Infrastructure configuration
```
