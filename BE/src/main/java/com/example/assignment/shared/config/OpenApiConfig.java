package com.example.assignment.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Global OpenAPI / Swagger configuration.
 * <p>
 * Swagger UI is available at: <a href="http://localhost:8080/swagger-ui.html">
 *     http://localhost:8080/swagger-ui.html</a>
 * </p>
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ecommerceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce Backend API")
                        .description("""
                                REST API for the E-Commerce platform.
                                
                                **Modules covered:**
                                - FR-01 Customer Management
                                - FR-02 Product Management
                                - FR-03 Order Placement & Checkout
                                - FR-04 Payment Integration
                                - FR-05 Cart Management
                                - FR-06 Promotions & Discounts
                                - FR-07 Analytics & Event Tracking
                                - FR-08 Demand Forecasting
                                - FR-09 Sales Reporting
                                - FR-10 Order Status Management
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("DBMS Assignment Team")
                                .email("team@example.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server")
                ))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth",
                                new io.swagger.v3.oas.models.security.SecurityScheme()
                                        .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("bearerAuth"));
    }
}
