package com.healio.notificationservice.service;

import java.time.LocalDateTime;

public interface SmsService {

    void sendSessionReminder(String phoneNumber, String title, LocalDateTime scheduledTime);
}
