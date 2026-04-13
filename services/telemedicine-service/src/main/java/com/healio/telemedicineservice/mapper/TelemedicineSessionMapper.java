package com.healio.telemedicineservice.mapper;

import com.healio.telemedicineservice.dto.CreateTelemedicineSessionRequest;
import com.healio.telemedicineservice.dto.JoinDetailsResponse;
import com.healio.telemedicineservice.dto.StartSessionResponse;
import com.healio.telemedicineservice.dto.TelemedicineSessionResponse;
import com.healio.telemedicineservice.dto.UpdateTelemedicineSessionRequest;
import com.healio.telemedicineservice.entity.TelemedicineSession;
import com.healio.telemedicineservice.enums.SessionStatus;
import org.springframework.stereotype.Component;

@Component
public class TelemedicineSessionMapper {

    public TelemedicineSession toEntity(CreateTelemedicineSessionRequest request, String channelName) {
        return TelemedicineSession.builder()
                .appointmentId(request.getAppointmentId())
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .sessionTitle(request.getSessionTitle())
                .description(request.getDescription())
                .scheduledStartTime(request.getScheduledStartTime())
                .scheduledEndTime(request.getScheduledEndTime())
                .status(SessionStatus.SCHEDULED)
                .agoraChannelName(channelName)
                .build();
    }

    public void updateEntity(TelemedicineSession session, UpdateTelemedicineSessionRequest request) {
        session.setSessionTitle(request.getSessionTitle());
        session.setDescription(request.getDescription());
        session.setScheduledStartTime(request.getScheduledStartTime());
        session.setScheduledEndTime(request.getScheduledEndTime());
    }

    public TelemedicineSessionResponse toResponse(TelemedicineSession session) {
        return TelemedicineSessionResponse.builder()
                .id(session.getId())
                .appointmentId(session.getAppointmentId())
                .patientId(session.getPatientId())
                .doctorId(session.getDoctorId())
                .sessionTitle(session.getSessionTitle())
                .description(session.getDescription())
                .scheduledStartTime(session.getScheduledStartTime())
                .scheduledEndTime(session.getScheduledEndTime())
                .actualStartTime(session.getActualStartTime())
                .actualEndTime(session.getActualEndTime())
                .status(session.getStatus())
                .agoraChannelName(session.getAgoraChannelName())
                .consultationNotes(session.getConsultationNotes())
                .prescriptionNotes(session.getPrescriptionNotes())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .build();
    }

    public StartSessionResponse toStartResponse(TelemedicineSession session, String appId) {
        return StartSessionResponse.builder()
                .sessionId(session.getId())
                .agoraAppId(appId)
                .agoraChannelName(session.getAgoraChannelName())
                .agoraToken(session.getAgoraToken())
                .status(session.getStatus())
                .actualStartTime(session.getActualStartTime())
                .build();
    }

    public JoinDetailsResponse toJoinDetailsResponse(TelemedicineSession session, String appId) {
        return JoinDetailsResponse.builder()
                .sessionId(session.getId())
                .agoraAppId(appId)
                .agoraChannelName(session.getAgoraChannelName())
                .agoraToken(session.getAgoraToken())
                .status(session.getStatus())
                .doctorId(session.getDoctorId())
                .patientId(session.getPatientId())
                .build();
    }
}
