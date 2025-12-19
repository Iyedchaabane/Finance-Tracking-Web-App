package com.financetracker.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Category management.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String icon;

    @NotBlank(message = "Color is required")
    private String color;

    @NotBlank(message = "Type is required")
    private String type;
}
