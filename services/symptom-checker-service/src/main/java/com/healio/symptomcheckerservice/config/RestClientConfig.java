package com.healio.symptomcheckerservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${gemini.base-url}")
    private String geminiBaseUrl;

    @Bean
    public RestClient geminiRestClient() {
        return RestClient.builder()
                .baseUrl(geminiBaseUrl)
                .build();
    }
}
