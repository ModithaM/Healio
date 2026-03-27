package com.healio.doctorservice.model;

import lombok.*;

import javax.persistence.*;

@Entity(name = "doctors")
@AllArgsConstructor
@NoArgsConstructor
public class Doctor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
