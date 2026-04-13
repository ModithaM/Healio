# Telemedicine Service API Examples

## Gateway Route

Frontend calls should go through the API Gateway:

```text
Frontend -> API Gateway -> Telemedicine Service
```

Recommended gateway-facing base path:

```text
/api/telemedicine/sessions
```

## Create Session

```http
POST /api/telemedicine/sessions
```

```json
{
  "appointmentId": "appt-1001",
  "patientId": "patient-42",
  "doctorId": "doctor-17",
  "sessionTitle": "Follow-up consultation",
  "description": "Review recovery progress",
  "scheduledStartTime": "2026-04-15T10:00:00",
  "scheduledEndTime": "2026-04-15T10:30:00"
}
```

```json
{
  "id": "5e96b4d0-1a47-4bb1-8f0d-9d83f0f50a44",
  "appointmentId": "appt-1001",
  "patientId": "patient-42",
  "doctorId": "doctor-17",
  "sessionTitle": "Follow-up consultation",
  "description": "Review recovery progress",
  "scheduledStartTime": "2026-04-15T10:00:00",
  "scheduledEndTime": "2026-04-15T10:30:00",
  "actualStartTime": null,
  "actualEndTime": null,
  "status": "SCHEDULED",
  "agoraChannelName": "telemedicine-appt-1001-2de0dc8f-3c6e-4f45-9b9e-d99fdc270d2c",
  "consultationNotes": null,
  "prescriptionNotes": null,
  "createdAt": "2026-04-13T09:30:00",
  "updatedAt": "2026-04-13T09:30:00"
}
```

## List Sessions

```http
GET /api/telemedicine/sessions?doctorId=doctor-17&patientId=patient-42&status=SCHEDULED
```

## Get Session

```http
GET /api/telemedicine/sessions/{id}
```

## Update Session

```http
PUT /api/telemedicine/sessions/{id}
```

```json
{
  "sessionTitle": "Follow-up consultation",
  "description": "Review updated lab results",
  "scheduledStartTime": "2026-04-15T10:15:00",
  "scheduledEndTime": "2026-04-15T10:45:00"
}
```

## Cancel Session

```http
PATCH /api/telemedicine/sessions/{id}/cancel
```

## Start Session

```http
PATCH /api/telemedicine/sessions/{id}/start
```

```json
{
  "sessionId": "5e96b4d0-1a47-4bb1-8f0d-9d83f0f50a44",
  "agoraAppId": "your-agora-app-id",
  "agoraChannelName": "telemedicine-appt-1001-2de0dc8f-3c6e-4f45-9b9e-d99fdc270d2c",
  "agoraToken": "007...",
  "status": "ONGOING",
  "actualStartTime": "2026-04-15T10:16:20"
}
```

## Complete Session

```http
PATCH /api/telemedicine/sessions/{id}/complete
```

## Update Notes

```http
PATCH /api/telemedicine/sessions/{id}/notes
```

```json
{
  "consultationNotes": "Patient reports reduced symptoms.",
  "prescriptionNotes": "Continue medication for 5 days."
}
```

## Join Details

```http
GET /api/telemedicine/sessions/{id}/join-details
```

```json
{
  "sessionId": "5e96b4d0-1a47-4bb1-8f0d-9d83f0f50a44",
  "agoraAppId": "your-agora-app-id",
  "agoraChannelName": "telemedicine-appt-1001-2de0dc8f-3c6e-4f45-9b9e-d99fdc270d2c",
  "agoraToken": "007...",
  "status": "ONGOING",
  "doctorId": "doctor-17",
  "patientId": "patient-42"
}
```

## Shared Configuration Expected

The service expects Agora values from the existing root/shared configuration source:

```properties
telemedicine.agora.app-id=your-agora-app-id
telemedicine.agora.app-certificate=your-agora-app-certificate
telemedicine.agora.token-expiration-seconds=3600
```

No datasource configuration is defined in this service.
