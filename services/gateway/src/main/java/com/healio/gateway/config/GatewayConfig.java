package com.healio.gateway.config;

import com.healio.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    private final JwtAuthenticationFilter filter;

    public GatewayConfig(JwtAuthenticationFilter filter) {
        this.filter = filter;
    }

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/v1/user/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://user-service"))

                .route("doctor-service", r -> r.path("/v1/doctor-service/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://doctor-service"))

                .route("patient-service", r -> r.path("/v1/patient-service/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://patient-service"))

                .route("appointment-service", r -> r.path("/v1/appointment-service/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://appointment-service"))

                .route("telemedicine-service", r -> r.path("/v1/telemedicine-service/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://telemedicine-service"))

                .route("auth-service", r -> r.path("/v1/auth/**")
                        .uri("lb://auth-service"))

                .build();
    }
}
