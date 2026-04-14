package com.healio.telemedicineservice.client;

import com.healio.telemedicineservice.dto.CreateNotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", path = "/v1/api/notifications")
public interface NotificationServiceClient {

    @PostMapping
    ResponseEntity<Void> createNotification(@RequestBody CreateNotificationRequest request);
}
