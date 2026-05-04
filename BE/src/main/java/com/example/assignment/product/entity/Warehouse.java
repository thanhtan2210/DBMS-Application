package com.example.assignment.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(name = "warehouse_name", nullable = false, length = 255)
    private String warehouseName;

    @Column(name = "location", length = 500)
    private String location;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";
}
