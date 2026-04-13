package com.healio.telemedicineservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "telemedicine.agora")
@Getter
@Setter
public class AgoraProperties {

    private String appId;
    private String appCertificate;
    private int tokenExpirationSeconds = 3600;
}
