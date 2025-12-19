package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a transaction category.
 * Categories are user-defined and used to organize financial transactions.
 * Supports soft deletion to maintain historical data integrity.
 */
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String icon;
    private String color;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    private boolean isDeleted = false;
}
