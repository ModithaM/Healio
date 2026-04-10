package com.healio.telemedicineservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TelemedicineServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TelemedicineServiceApplication.class, args);
    }

}
