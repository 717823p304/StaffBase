package com.staffbase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.staffbase.repositories.jpa")
@EnableMongoRepositories(basePackages = "com.staffbase.repositories.mongo")
public class StaffBaseApplication {
    public static void main(String[] args) {
        // Force TLS 1.2 to bypass JDK 23 handshake compatibility bugs with MongoDB Atlas clusters
        System.setProperty("jdk.tls.client.protocols", "TLSv1.2");
        
        SpringApplication.run(StaffBaseApplication.class, args);
    }
}
