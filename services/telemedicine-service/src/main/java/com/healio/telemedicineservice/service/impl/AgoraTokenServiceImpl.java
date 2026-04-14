package com.healio.telemedicineservice.service.impl;

import com.healio.telemedicineservice.config.AgoraProperties;
import com.healio.telemedicineservice.exception.TelemedicineBadRequestException;
import com.healio.telemedicineservice.service.AgoraTokenService;
import io.agora.media.RtcTokenBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AgoraTokenServiceImpl implements AgoraTokenService {

    private final AgoraProperties agoraProperties;

    @Override
    public String getAppId() {
        if (!StringUtils.hasText(agoraProperties.getAppId())) {
            throw new TelemedicineBadRequestException("Agora app id is not configured");
        }
        return agoraProperties.getAppId();
    }

    @Override
    public String generateRtcToken(String channelName) {
        if (!StringUtils.hasText(agoraProperties.getAppCertificate())) {
            throw new TelemedicineBadRequestException("Agora app certificate is not configured");
        }

        int privilegeExpiredTs = (int) (System.currentTimeMillis() / 1000
                + agoraProperties.getTokenExpirationSeconds());
        RtcTokenBuilder tokenBuilder = new RtcTokenBuilder();
        return tokenBuilder.buildTokenWithUid(
                getAppId(),
                agoraProperties.getAppCertificate(),
                channelName,
                0,
                RtcTokenBuilder.Role.Role_Publisher,
                privilegeExpiredTs
        );
    }
}
