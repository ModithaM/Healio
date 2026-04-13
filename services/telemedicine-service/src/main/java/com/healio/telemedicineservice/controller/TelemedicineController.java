package com.healio.telemedicineservice.controller;

import com.healio.telemedicineservice.dto.CreateTelemedicineSessionRequest;
import com.healio.telemedicineservice.dto.JoinDetailsResponse;
import com.healio.telemedicineservice.dto.StartSessionResponse;
import com.healio.telemedicineservice.dto.TelemedicineSessionResponse;
import com.healio.telemedicineservice.dto.UpdateNotesRequest;
import com.healio.telemedicineservice.dto.UpdateTelemedicineSessionRequest;
import com.healio.telemedicineservice.enums.SessionStatus;
import com.healio.telemedicineservice.service.TelemedicineSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/telemedicine-service/sessions")
@RequiredArgsConstructor
public class TelemedicineController {

    private final TelemedicineSessionService telemedicineSessionService;

    @PostMapping
    public ResponseEntity<TelemedicineSessionResponse> createSession(
            @Valid @RequestBody CreateTelemedicineSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(telemedicineSessionService.createSession(request));
    }

    @GetMapping
    public ResponseEntity<List<TelemedicineSessionResponse>> getSessions(
            @RequestParam(required = false) String doctorId,
            @RequestParam(required = false) String patientId,
            @RequestParam(required = false) SessionStatus status) {
        return ResponseEntity.ok(telemedicineSessionService.getSessions(doctorId, patientId, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TelemedicineSessionResponse> getSessionById(@PathVariable String id) {
        return ResponseEntity.ok(telemedicineSessionService.getSessionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TelemedicineSessionResponse> updateSession(
            @PathVariable String id,
            @Valid @RequestBody UpdateTelemedicineSessionRequest request) {
        return ResponseEntity.ok(telemedicineSessionService.updateSession(id, request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<TelemedicineSessionResponse> cancelSession(@PathVariable String id) {
        return ResponseEntity.ok(telemedicineSessionService.cancelSession(id));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<StartSessionResponse> startSession(@PathVariable String id) {
        return ResponseEntity.ok(telemedicineSessionService.startSession(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TelemedicineSessionResponse> completeSession(@PathVariable String id) {
        return ResponseEntity.ok(telemedicineSessionService.completeSession(id));
    }

    @PatchMapping("/{id}/notes")
    public ResponseEntity<TelemedicineSessionResponse> updateNotes(
            @PathVariable String id,
            @Valid @RequestBody UpdateNotesRequest request) {
        return ResponseEntity.ok(telemedicineSessionService.updateNotes(id, request));
    }

    @GetMapping("/{id}/join-details")
    public ResponseEntity<JoinDetailsResponse> getJoinDetails(@PathVariable String id) {
        return ResponseEntity.ok(telemedicineSessionService.getJoinDetails(id));
    }
}
