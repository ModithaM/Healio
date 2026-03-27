package com.healio.doctorservice.model;

import lombok.*;

import javax.persistence.*;

@Entity(name = "patients")
@AllArgsConstructor
@NoArgsConstructor
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
