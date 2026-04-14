package com.healio.telemedicineservice.service;

import com.healio.telemedicineservice.dto.CreateTelemedicineSessionRequest;
import com.healio.telemedicineservice.dto.JoinDetailsResponse;
import com.healio.telemedicineservice.dto.StartSessionResponse;
import com.healio.telemedicineservice.dto.TelemedicineSessionResponse;
import com.healio.telemedicineservice.dto.UpdateNotesRequest;
import com.healio.telemedicineservice.dto.UpdateTelemedicineSessionRequest;
import com.healio.telemedicineservice.enums.SessionStatus;

import java.util.List;

public interface TelemedicineSessionService {

    TelemedicineSessionResponse createSession(CreateTelemedicineSessionRequest request);

    List<TelemedicineSessionResponse> getSessions(String doctorId, String patientId, SessionStatus status);

    TelemedicineSessionResponse getSessionById(String id);

    TelemedicineSessionResponse updateSession(String id, UpdateTelemedicineSessionRequest request);

    TelemedicineSessionResponse cancelSession(String id);

    void deleteSession(String id);

    StartSessionResponse startSession(String id);

    TelemedicineSessionResponse completeSession(String id);

    TelemedicineSessionResponse updateNotes(String id, UpdateNotesRequest request);

    JoinDetailsResponse getJoinDetails(String id);
}
