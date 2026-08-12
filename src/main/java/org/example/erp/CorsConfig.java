package org.example.erp;



import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS configuration for Spring Boot.
 *
 * This allows the React frontend (running on localhost:3000 or localhost:5173)
 * to make requests to the Spring Boot backend (localhost:8080).
 *
 * Place this file at: src/main/java/com/yourapp/config/CorsConfig.java
 * (replace "com.yourapp" with your actual package name)
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")              // Apply to ALL endpoints
                .allowedOrigins(
                        "http://localhost:3000",    // React (Create React App)
                        "http://localhost:5173",    // React (Vite)
                        "http://127.0.0.1:3000",
                        "http://127.0.0.1:5173"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}

