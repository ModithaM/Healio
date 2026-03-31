package com.healio.appointmentservice.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity(name = "appointment")
@AllArgsConstructor
@NoArgsConstructor
public class Appointment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
