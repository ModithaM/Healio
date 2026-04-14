package com.healio.telemedicineservice.entity;

import com.healio.telemedicineservice.enums.SessionStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "telemedicine_sessions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TelemedicineSession {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @Column(nullable = false)
    private String appointmentId;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private String sessionTitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime scheduledStartTime;

    @Column(nullable = false)
    private LocalDateTime scheduledEndTime;

    private LocalDateTime actualStartTime;

    private LocalDateTime actualEndTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    @Column(name = "channel_name", nullable = false, unique = true)
    private String agoraChannelName;

    @Column(name = "agora_channel_name", nullable = false)
    private String agoraChannelNameMirror;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Column(columnDefinition = "TEXT")
    private String agoraToken;

    @Column(columnDefinition = "TEXT")
    private String consultationNotes;

    @Column(columnDefinition = "TEXT")
    private String prescriptionNotes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        syncAgoraChannelNameColumns();
        updateDurationMinutes();
        if (status == null) {
            status = SessionStatus.SCHEDULED;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
        syncAgoraChannelNameColumns();
        updateDurationMinutes();
    }

    private void syncAgoraChannelNameColumns() {
        agoraChannelNameMirror = agoraChannelName;
    }

    private void updateDurationMinutes() {
        if (scheduledStartTime != null && scheduledEndTime != null) {
            durationMinutes = Math.toIntExact(ChronoUnit.MINUTES.between(scheduledStartTime, scheduledEndTime));
        }
    }
}
