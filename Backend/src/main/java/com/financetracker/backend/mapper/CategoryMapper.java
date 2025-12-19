package com.financetracker.backend.mapper;

import com.financetracker.backend.dto.CategoryDTO;
import com.financetracker.backend.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for converting between Category entity and CategoryDTO.
 * Handles the mapping of nested objects and supports custom entity creation
 * logic.
 */
@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toDto(Category category);

    @Mapping(target = "user", ignore = true)
    Category toEntity(CategoryDTO dto);
}
