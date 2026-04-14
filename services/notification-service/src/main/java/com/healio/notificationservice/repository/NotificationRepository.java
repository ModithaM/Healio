package com.healio.notificationservice.repository;

import com.healio.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(String userId);

    List<Notification> findByUserIdAndScheduledForBetweenOrderByScheduledForAscCreatedAtDesc(
            String userId,
            LocalDateTime start,
            LocalDateTime end
    );
}
