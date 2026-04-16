package com.healio.symptomcheckerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SymptomCheckerServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SymptomCheckerServiceApplication.class, args);
    }
}
