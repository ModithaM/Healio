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

                .route("doctor-service", r -> r.path("/api/doctors/**", "/v1/api/doctors/**", "/v1/doctor-service/**")
                        .filters(f -> f.filter(filter)
                                .rewritePath("/v1/(?<segment>api/doctors/?.*)", "/${segment}"))
                        .uri("lb://doctor-service"))

                .route("patient-service", r -> r.path("/api/patients/**", "/v1/api/patients/**", "/patient-service/**", "/v1/patient-service/**")
                        .filters(f -> f.filter(filter)
                                .rewritePath("/v1/(?<segment>api/patients/?.*)", "/${segment}")
                                .rewritePath("/v1/(?<segment>patient-service/?.*)", "/${segment}")
                                .rewritePath("/patient-service/(?<segment>.*)", "/api/patients/${segment}")
                                .rewritePath("/v1/patient-service/(?<segment>.*)", "/api/patients/${segment}"))
                        .uri("lb://patient-service"))

                .route("appointment-service", r -> r.path("/api/appointments/**", "/v1/api/appointments/**", "/v1/appointment-service/**")
                        .filters(f -> f.filter(filter)
                                .rewritePath("/v1/(?<segment>api/appointments/?.*)", "/${segment}"))
                        .uri("lb://appointment-service"))

                .route("telemedicine-service", r -> r.path("/api/telemedicine/**", "/v1/api/telemedicine/**", "/v1/telemedicine-service/**")
                        .filters(f -> f.filter(filter)
                                .rewritePath("/v1/(?<segment>api/telemedicine/?.*)", "/${segment}"))
                        .uri("lb://telemedicine-service"))

                .route("auth-service", r -> r.path("/v1/auth/**")
                        .uri("lb://auth-service"))

                .build();
    }
}
