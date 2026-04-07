package com.healio.telemedicineservice.model;

import com.healio.telemedicineservice.enums.SessionStatus;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity(name = "telemedicine_sessions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TelemedicineSession extends BaseEntity {

    @Column(nullable = false)
    private String appointmentId;

    @Column(nullable = false)
    private String channelName;

    @Column(nullable = true)
    private String providerSessionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    @Column(nullable = true)
    private LocalDateTime startedAt;

    @Column(nullable = true)
    private LocalDateTime endedAt;

    @Column(nullable = false)
    private Integer durationMinutes;
}
