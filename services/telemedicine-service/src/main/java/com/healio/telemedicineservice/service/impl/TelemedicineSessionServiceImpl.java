package com.healio.telemedicineservice.service.impl;

import com.healio.telemedicineservice.client.NotificationServiceClient;
import com.healio.telemedicineservice.dto.CreateTelemedicineSessionRequest;
import com.healio.telemedicineservice.dto.CreateNotificationRequest;
import com.healio.telemedicineservice.dto.JoinDetailsResponse;
import com.healio.telemedicineservice.dto.StartSessionResponse;
import com.healio.telemedicineservice.dto.TelemedicineSessionResponse;
import com.healio.telemedicineservice.dto.UpdateNotesRequest;
import com.healio.telemedicineservice.dto.UpdateTelemedicineSessionRequest;
import com.healio.telemedicineservice.entity.TelemedicineSession;
import com.healio.telemedicineservice.enums.SessionStatus;
import com.healio.telemedicineservice.exception.TelemedicineBadRequestException;
import com.healio.telemedicineservice.exception.TelemedicineNotFoundException;
import com.healio.telemedicineservice.mapper.TelemedicineSessionMapper;
import com.healio.telemedicineservice.repository.TelemedicineSessionRepository;
import com.healio.telemedicineservice.service.AgoraTokenService;
import com.healio.telemedicineservice.service.TelemedicineSessionService;
import com.healio.telemedicineservice.util.AgoraChannelNameGenerator;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TelemedicineSessionServiceImpl implements TelemedicineSessionService {
    private static final String TELEMEDICINE_SOURCE = "telemedicine-service";

    private final TelemedicineSessionRepository sessionRepository;
    private final TelemedicineSessionMapper sessionMapper;
    private final AgoraChannelNameGenerator channelNameGenerator;
    private final AgoraTokenService agoraTokenService;
    private final NotificationServiceClient notificationServiceClient;

    private static final DateTimeFormatter SESSION_TIME_FORMATTER = DateTimeFormatter.ofPattern("MMM d, yyyy 'at' h:mm a");

    @Override
    public TelemedicineSessionResponse createSession(CreateTelemedicineSessionRequest request) {
        validateSchedule(request.getScheduledStartTime(), request.getScheduledEndTime());
        if (sessionRepository.existsByAppointmentId(request.getAppointmentId())) {
            throw new TelemedicineBadRequestException("Telemedicine session already exists for this appointment");
        }

        String channelName = generateUniqueChannelName(request.getAppointmentId());
        TelemedicineSession session = sessionMapper.toEntity(request, channelName);
        ensureValidAgoraChannelName(session);
        TelemedicineSession savedSession = sessionRepository.save(session);
        sendSessionCreatedNotifications(savedSession);
        return sessionMapper.toResponse(savedSession);
    }

    @Override
    public List<TelemedicineSessionResponse> getSessions(String doctorId, String patientId, SessionStatus status) {
        Specification<TelemedicineSession> specification = buildSpecification(doctorId, patientId, status);
        return sessionRepository.findAll(specification).stream()
                .map(session -> {
                    ensureValidAgoraChannelName(session);
                    return sessionRepository.save(session);
                })
                .map(sessionMapper::toResponse)
                .toList();
    }

    @Override
    public TelemedicineSessionResponse getSessionById(String id) {
        TelemedicineSession session = getSessionOrThrow(id);
        ensureValidAgoraChannelName(session);
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    @Override
    public TelemedicineSessionResponse updateSession(String id, UpdateTelemedicineSessionRequest request) {
        validateSchedule(request.getScheduledStartTime(), request.getScheduledEndTime());
        TelemedicineSession session = getSessionOrThrow(id);
        ensureEditable(session);

        sessionMapper.updateEntity(session, request);
        ensureValidAgoraChannelName(session);
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    @Override
    public TelemedicineSessionResponse cancelSession(String id) {
        TelemedicineSession session = getSessionOrThrow(id);
        ensureEditable(session);
        ensureValidAgoraChannelName(session);
        session.setStatus(SessionStatus.CANCELLED);
        TelemedicineSession savedSession = sessionRepository.save(session);
        sendSessionStatusNotification(savedSession, "SESSION_CANCELLED", "Telemedicine Session Cancelled", "Your telemedicine session has been cancelled.");
        return sessionMapper.toResponse(savedSession);
    }

    @Override
    public void deleteSession(String id) {
        TelemedicineSession session = getSessionOrThrow(id);
        if (session.getStatus() == SessionStatus.ONGOING) {
            throw new TelemedicineBadRequestException("Ongoing sessions cannot be deleted");
        }

        sessionRepository.delete(session);
    }

    @Override
    public StartSessionResponse startSession(String id) {
        TelemedicineSession session = getSessionOrThrow(id);
        if (session.getStatus() == SessionStatus.CANCELLED) {
            throw new TelemedicineBadRequestException("Cancelled sessions cannot be started");
        }
        if (session.getStatus() != SessionStatus.SCHEDULED && session.getStatus() != SessionStatus.WAITING) {
            throw new TelemedicineBadRequestException("Only SCHEDULED or WAITING sessions can be started");
        }

        session.setStatus(SessionStatus.ONGOING);
        session.setActualStartTime(LocalDateTime.now());
        ensureValidAgoraChannelName(session);
        log.info("Starting Agora session {} with channel {}", session.getId(), session.getAgoraChannelName());
        session.setAgoraToken(agoraTokenService.generateRtcToken(session.getAgoraChannelName()));
        TelemedicineSession savedSession = sessionRepository.save(session);
        sendSessionStatusNotification(savedSession, "SESSION_STARTED", "Telemedicine Session Started", "Your telemedicine session is now live.");
        return sessionMapper.toStartResponse(savedSession, agoraTokenService.getAppId());
    }

    @Override
    public TelemedicineSessionResponse completeSession(String id) {
        TelemedicineSession session = getSessionOrThrow(id);
        if (session.getStatus() == SessionStatus.CANCELLED) {
            throw new TelemedicineBadRequestException("Cancelled sessions cannot be completed");
        }
        if (session.getStatus() == SessionStatus.COMPLETED) {
            return sessionMapper.toResponse(session);
        }

        session.setStatus(SessionStatus.COMPLETED);
        session.setActualEndTime(LocalDateTime.now());
        ensureValidAgoraChannelName(session);
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    @Override
    public TelemedicineSessionResponse updateNotes(String id, UpdateNotesRequest request) {
        TelemedicineSession session = getSessionOrThrow(id);
        ensureEditable(session);
        ensureValidAgoraChannelName(session);
        session.setConsultationNotes(request.getConsultationNotes());
        session.setPrescriptionNotes(request.getPrescriptionNotes());
        return sessionMapper.toResponse(sessionRepository.save(session));
    }

    @Override
    public JoinDetailsResponse getJoinDetails(String id) {
        TelemedicineSession session = getSessionOrThrow(id);
        if (session.getStatus() == SessionStatus.CANCELLED) {
            throw new TelemedicineBadRequestException("Cancelled sessions do not have join details");
        }
        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new TelemedicineBadRequestException("Completed sessions do not have active join details");
        }
        ensureValidAgoraChannelName(session);
        log.info("Returning Agora join details for session {} with channel {}", session.getId(), session.getAgoraChannelName());
        session.setAgoraToken(agoraTokenService.generateRtcToken(session.getAgoraChannelName()));
        session = sessionRepository.save(session);
        return sessionMapper.toJoinDetailsResponse(session, agoraTokenService.getAppId());
    }

    private TelemedicineSession getSessionOrThrow(String id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new TelemedicineNotFoundException("Telemedicine session not found: " + id));
    }

    private void validateSchedule(LocalDateTime scheduledStartTime, LocalDateTime scheduledEndTime) {
        if (!scheduledStartTime.isBefore(scheduledEndTime)) {
            throw new TelemedicineBadRequestException("scheduledStartTime must be before scheduledEndTime");
        }
    }

    private void ensureEditable(TelemedicineSession session) {
        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new TelemedicineBadRequestException("Completed sessions cannot be edited");
        }
    }

    private String generateUniqueChannelName(String appointmentId) {
        String channelName;
        do {
            channelName = channelNameGenerator.generate(appointmentId);
        } while (sessionRepository.existsByAgoraChannelName(channelName));
        return channelName;
    }

    private void ensureValidAgoraChannelName(TelemedicineSession session) {
        if (!channelNameGenerator.isValid(session.getAgoraChannelName())) {
            session.setAgoraChannelName(generateUniqueChannelName(session.getAppointmentId()));
        }

        if (!channelNameGenerator.isValid(session.getAgoraChannelName())) {
            throw new TelemedicineBadRequestException("Unable to generate a valid Agora channel name");
        }
    }

    private void sendSessionCreatedNotifications(TelemedicineSession session) {
        String scheduledTime = session.getScheduledStartTime().format(SESSION_TIME_FORMATTER);
        notifySafely(CreateNotificationRequest.builder()
                .userId(session.getPatientId())
                .role("PATIENT")
                .type("SESSION_CREATED")
                .title("New Telemedicine Session Scheduled")
                .message("A doctor has scheduled \"" + session.getSessionTitle() + "\" for you on " + scheduledTime + ".")
                .referenceId(session.getId())
                .sourceService(TELEMEDICINE_SOURCE)
                .actionUrl(buildTelemedicineActionUrl("PATIENT", session.getId()))
                .scheduledFor(session.getScheduledStartTime())
                .build());

        notifySafely(CreateNotificationRequest.builder()
                .userId(session.getDoctorId())
                .role("DOCTOR")
                .type("SESSION_CREATED")
                .title("Telemedicine Session Created")
                .message("Your session \"" + session.getSessionTitle() + "\" is scheduled for " + scheduledTime + ".")
                .referenceId(session.getId())
                .sourceService(TELEMEDICINE_SOURCE)
                .actionUrl(buildTelemedicineActionUrl("DOCTOR", session.getId()))
                .scheduledFor(session.getScheduledStartTime())
                .build());

        if (session.getScheduledStartTime().toLocalDate().isEqual(LocalDateTime.now().toLocalDate())) {
            sendTodayNotification(session, session.getPatientId(), "PATIENT");
            sendTodayNotification(session, session.getDoctorId(), "DOCTOR");
        }
    }

    private void sendTodayNotification(TelemedicineSession session, String userId, String role) {
        notifySafely(CreateNotificationRequest.builder()
                .userId(userId)
                .role(role)
                .type("SESSION_TODAY")
                .title("Telemedicine Session Today")
                .message("\"" + session.getSessionTitle() + "\" is scheduled today at " + session.getScheduledStartTime().format(DateTimeFormatter.ofPattern("h:mm a")) + ".")
                .referenceId(session.getId())
                .sourceService(TELEMEDICINE_SOURCE)
                .actionUrl(buildTelemedicineActionUrl(role, session.getId()))
                .scheduledFor(session.getScheduledStartTime())
                .build());
    }

    private void sendSessionStatusNotification(TelemedicineSession session, String type, String title, String message) {
        notifySafely(CreateNotificationRequest.builder()
                .userId(session.getPatientId())
                .role("PATIENT")
                .type(type)
                .title(title)
                .message(message)
                .referenceId(session.getId())
                .sourceService(TELEMEDICINE_SOURCE)
                .actionUrl(buildTelemedicineActionUrl("PATIENT", session.getId()))
                .scheduledFor(session.getScheduledStartTime())
                .build());
        notifySafely(CreateNotificationRequest.builder()
                .userId(session.getDoctorId())
                .role("DOCTOR")
                .type(type)
                .title(title)
                .message(message)
                .referenceId(session.getId())
                .sourceService(TELEMEDICINE_SOURCE)
                .actionUrl(buildTelemedicineActionUrl("DOCTOR", session.getId()))
                .scheduledFor(session.getScheduledStartTime())
                .build());
    }

    private String buildTelemedicineActionUrl(String role, String sessionId) {
        String dashboardPath = "DOCTOR".equalsIgnoreCase(role) ? "/doctor-dashboard" : "/patient-dashboard";
        return dashboardPath + "?sessionId=" + sessionId;
    }

    private void notifySafely(CreateNotificationRequest request) {
        try {
            notificationServiceClient.createNotification(request);
        } catch (Exception exception) {
            log.warn("Unable to send {} notification for reference {} to user {}",
                    request.getType(), request.getReferenceId(), request.getUserId(), exception);
        }
    }

    private Specification<TelemedicineSession> buildSpecification(String doctorId, String patientId, SessionStatus status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (doctorId != null && !doctorId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("doctorId"), doctorId));
            }
            if (patientId != null && !patientId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("patientId"), patientId));
            }
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
