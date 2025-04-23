package com.Capstone.IskoLAIR.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allow all endpoints
                        .allowedOrigins("https://capstone-tau-two.vercel.app/") // Allow frontend requests from React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow methods
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true); // Allow cookies and authentication headers

                // Explicitly allow the staff route
                registry.addMapping("/api/staff/register-scholar")
                        .allowedOrigins("https://capstone-tau-two.vercel.app/")
                        .allowedMethods("POST")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
