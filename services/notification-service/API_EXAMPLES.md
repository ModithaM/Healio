# Notification Service API Examples

Gateway base path:

```text
/v1/api/notifications
```

Frontend API clients use `/api/notifications` because `NEXT_PUBLIC_API_BASE_URL` already points at the API Gateway `/v1` base.

## Create Notification

```http
POST /v1/api/notifications
Content-Type: application/json
```

```json
{
  "userId": "patient-42",
  "role": "PATIENT",
  "type": "SESSION_CREATED",
  "title": "New Telemedicine Session Scheduled",
  "message": "A doctor has scheduled \"Cardiology Follow-up\" for you on Apr 14, 2026 at 10:00 AM.",
  "referenceId": "session-1001",
  "sourceService": "telemedicine-service",
  "actionUrl": "/patient-dashboard?sessionId=session-1001",
  "scheduledFor": "2026-04-14T10:00:00"
}
```

```json
{
  "id": "notification-1",
  "userId": "patient-42",
  "role": "PATIENT",
  "type": "SESSION_CREATED",
  "title": "New Telemedicine Session Scheduled",
  "message": "A doctor has scheduled \"Cardiology Follow-up\" for you on Apr 14, 2026 at 10:00 AM.",
  "isRead": false,
  "referenceId": "session-1001",
  "sourceService": "telemedicine-service",
  "actionUrl": "/patient-dashboard?sessionId=session-1001",
  "scheduledFor": "2026-04-14T10:00:00",
  "createdAt": "2026-04-14T09:15:00"
}
```

## Read APIs

```http
GET /v1/api/notifications/{userId}
GET /v1/api/notifications/{userId}/unread
GET /v1/api/notifications/{userId}/today
PATCH /v1/api/notifications/{id}/read
```

## Integration Flow

1. Doctor creates a session with `POST /v1/telemedicine-service/sessions`.
2. Telemedicine Service saves the session.
3. Telemedicine Service calls Notification Service through `NotificationServiceClient`.
4. Notification Service stores `SESSION_CREATED` notifications for the patient and doctor.
5. If `scheduledStartTime` is today, Telemedicine Service also creates `SESSION_TODAY` notifications.
6. Doctor and patient dashboards poll the notification API through the API Gateway.
7. Clicking a notification marks it read and follows `actionUrl` when present, which lets each service decide where the user should land.
