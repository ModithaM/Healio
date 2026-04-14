package com.healio.appointmentservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.healio.appointmentservice.dto.*;
import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.request.AppointmentCreateRequest;
import com.healio.appointmentservice.request.AppointmentStatusUpdateRequest;
import com.healio.appointmentservice.request.AppointmentUpdateRequest;
import com.healio.appointmentservice.request.PrescriptionCreateRequest;
import com.healio.appointmentservice.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AppointmentControllerTest {

        private final AppointmentService appointmentService = mock(AppointmentService.class);

    private MockMvc mockMvc;

        private final ObjectMapper objectMapper = new ObjectMapper()
                        .registerModule(new JavaTimeModule())
                        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        @BeforeEach
        void setUp() {
                mockMvc = standaloneSetup(new AppointmentController(appointmentService))
                                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                                .build();
        }

    @Test
    void shouldCreateAppointment() throws Exception {
        AppointmentResponseDto response = appointmentResponse("appt-1");
        when(appointmentService.createAppointment(any())).thenReturn(response);

        AppointmentCreateRequest request = AppointmentCreateRequest.builder()
                .patientId("patient-1")
                .doctorId("doctor-1")
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 30))
                .reason("Follow up")
                .build();

        mockMvc.perform(post("/v1/appointment-service/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"))
                .andExpect(jsonPath("$.patientId").value("patient-1"));
    }

    @Test
    void shouldGetAllAppointments() throws Exception {
        when(appointmentService.getAllAppointments()).thenReturn(List.of(appointmentResponse("appt-1")));

        mockMvc.perform(get("/v1/appointment-service/appointments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("appt-1"));
    }

    @Test
    void shouldGetAppointmentById() throws Exception {
        when(appointmentService.getAppointmentById("appt-1")).thenReturn(appointmentResponse("appt-1"));

        mockMvc.perform(get("/v1/appointment-service/appointments/appt-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"));
    }

    @Test
    void shouldGetAppointmentsByPatientId() throws Exception {
        when(appointmentService.getAppointmentsByPatientId("patient-1")).thenReturn(List.of(appointmentResponse("appt-1")));

        mockMvc.perform(get("/v1/appointment-service/appointments/patient/patient-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].patientId").value("patient-1"));
    }

    @Test
    void shouldGetAppointmentsByDoctorId() throws Exception {
        when(appointmentService.getAppointmentsByDoctorId("doctor-1")).thenReturn(List.of(appointmentResponse("appt-1")));

        mockMvc.perform(get("/v1/appointment-service/appointments/doctor/doctor-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].doctorId").value("doctor-1"));
    }

    @Test
    void shouldGetAppointmentsByStatus() throws Exception {
        when(appointmentService.getAppointmentsByStatus(AppointmentStatus.PENDING)).thenReturn(List.of(appointmentResponse("appt-1")));

        mockMvc.perform(get("/v1/appointment-service/appointments/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void shouldUpdateAppointment() throws Exception {
        when(appointmentService.updateAppointment(eq("appt-1"), any())).thenReturn(appointmentResponse("appt-1"));

        AppointmentUpdateRequest request = AppointmentUpdateRequest.builder()
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(11, 0))
                .reason("Updated reason")
                .build();

        mockMvc.perform(put("/v1/appointment-service/appointments/appt-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"));
    }

    @Test
    void shouldUpdateStatus() throws Exception {
        when(appointmentService.updateStatus(eq("appt-1"), any())).thenReturn(appointmentResponse("appt-1"));

        AppointmentStatusUpdateRequest request = AppointmentStatusUpdateRequest.builder()
                .status(AppointmentStatus.CONFIRMED)
                .build();

        mockMvc.perform(patch("/v1/appointment-service/appointments/appt-1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void shouldConfirmAppointment() throws Exception {
        when(appointmentService.markConfirmed("appt-1")).thenReturn(appointmentResponse("appt-1"));

        mockMvc.perform(patch("/v1/appointment-service/appointments/appt-1/confirm"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"));
    }

    @Test
    void shouldCompleteAppointment() throws Exception {
        when(appointmentService.markCompleted("appt-1")).thenReturn(appointmentResponse("appt-1"));

        mockMvc.perform(patch("/v1/appointment-service/appointments/appt-1/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"));
    }

    @Test
    void shouldMarkNoShow() throws Exception {
        when(appointmentService.markNoShow("appt-1")).thenReturn(appointmentResponse("appt-1"));

        mockMvc.perform(patch("/v1/appointment-service/appointments/appt-1/no-show"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"));
    }

    @Test
    void shouldDeleteAppointment() throws Exception {
        mockMvc.perform(delete("/v1/appointment-service/appointments/appt-1"))
                .andExpect(status().isOk());

        verify(appointmentService).deleteAppointment("appt-1");
    }

    @Test
    void shouldCancelAppointment() throws Exception {
        when(appointmentService.cancelAppointment("appt-1", "Patient requested cancellation")).thenReturn(appointmentResponse("appt-1"));

        mockMvc.perform(post("/v1/appointment-service/appointments/appt-1/cancel")
                        .param("reason", "Patient requested cancellation"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("appt-1"));
    }

    @Test
    void shouldCreatePrescription() throws Exception {
        when(appointmentService.createPrescription(eq("appt-1"), any())).thenReturn(prescriptionResponse("rx-1", "appt-1"));

        PrescriptionCreateRequest request = PrescriptionCreateRequest.builder()
                .diagnosis("Flu")
                .notes("Rest and hydrate")
                .issuedDate(LocalDate.now())
                .items(List.of(
                        com.healio.appointmentservice.request.PrescriptionItemRequest.builder()
                                .medicineName("Paracetamol")
                                .dosage("500mg")
                                .frequency("Twice a day")
                                .duration("5 days")
                                .instructions("After meals")
                                .build()))
                .build();

        mockMvc.perform(post("/v1/appointment-service/appointments/appt-1/prescriptions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rx-1"))
                .andExpect(jsonPath("$.appointmentId").value("appt-1"));
    }

    @Test
    void shouldGetPrescriptionByAppointmentId() throws Exception {
        when(appointmentService.getPrescriptionByAppointmentId("appt-1")).thenReturn(prescriptionResponse("rx-1", "appt-1"));

        mockMvc.perform(get("/v1/appointment-service/appointments/appt-1/prescription"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("rx-1"));
    }

    @Test
    void shouldGetPrescriptionsByPatientId() throws Exception {
        when(appointmentService.getPrescriptionsByPatientId("patient-1")).thenReturn(List.of(prescriptionResponse("rx-1", "appt-1")));

        mockMvc.perform(get("/v1/appointment-service/prescriptions/patient/patient-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("rx-1"));
    }

    private AppointmentResponseDto appointmentResponse(String id) {
        return AppointmentResponseDto.builder()
                .id(id)
                .patientId("patient-1")
                .doctorId("doctor-1")
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 30))
                .status(AppointmentStatus.PENDING)
                .reason("Follow up")
                .creationTimestamp(LocalDateTime.now())
                .updateTimestamp(LocalDateTime.now())
                .build();
    }

    private PrescriptionResponseDto prescriptionResponse(String id, String appointmentId) {
        return PrescriptionResponseDto.builder()
                .id(id)
                .appointmentId(appointmentId)
                .doctorId("doctor-1")
                .patientId("patient-1")
                .diagnosis("Flu")
                .issuedDate(LocalDate.now())
                .items(List.of(
                        PrescriptionItemResponseDto.builder()
                                .id("item-1")
                                .medicineName("Paracetamol")
                                .dosage("500mg")
                                .frequency("Twice a day")
                                .duration("5 days")
                                .instructions("After meals")
                                .build()))
                .build();
    }
}