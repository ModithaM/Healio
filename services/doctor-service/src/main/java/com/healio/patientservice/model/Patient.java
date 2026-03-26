package com.healio.patientservice.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity(name = "patients")
@AllArgsConstructor
@NoArgsConstructor
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
