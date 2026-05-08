package com.example.assignment;

import com.example.assignment.product.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableCaching
@ConfigurationPropertiesScan
public class MainApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    @Bean
    public CommandLineRunner initEmbeddings(ProductService productService) {
        return args -> {
            try {
                System.out.println(">>> [SYSTEM] Checking missing embeddings...");
                productService.backfillEmbeddings();
                System.out.println(">>> [SYSTEM] Embedding backfill complete.");
            } catch (Exception e) {
                System.err.println(">>> [SYSTEM] Failed to backfill embeddings: " + e.getMessage());
            }
        };
    }

}
