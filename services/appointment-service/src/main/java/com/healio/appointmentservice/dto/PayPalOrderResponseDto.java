package com.healio.appointmentservice.dto;

import com.healio.appointmentservice.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayPalOrderResponseDto {
    private String appointmentId;
    private String orderId;
    private String orderStatus;
    private String approveUrl;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus paymentStatus;
}
