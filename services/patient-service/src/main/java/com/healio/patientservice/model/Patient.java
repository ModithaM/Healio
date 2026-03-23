package com.healio.patientservice.model;

import com.healio.patientservice.enums.AdvertStatus;
import com.healio.patientservice.enums.Advertiser;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity(name = "patients")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Patient extends BaseEntity {

}
