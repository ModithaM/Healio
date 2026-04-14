package com.healio.telemedicineservice.service;

public interface AgoraTokenService {

    String getAppId();

    String generateRtcToken(String channelName);
}
