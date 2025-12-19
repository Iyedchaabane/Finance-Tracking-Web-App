package com.financetracker.backend.mapper;

import com.financetracker.backend.dto.CategoryDTO;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.TransactionType;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-19T11:32:33+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class CategoryMapperImpl implements CategoryMapper {

    @Override
    public CategoryDTO toDto(Category category) {
        if ( category == null ) {
            return null;
        }

        CategoryDTO.CategoryDTOBuilder categoryDTO = CategoryDTO.builder();

        categoryDTO.color( category.getColor() );
        categoryDTO.icon( category.getIcon() );
        categoryDTO.id( category.getId() );
        categoryDTO.name( category.getName() );
        if ( category.getType() != null ) {
            categoryDTO.type( category.getType().name() );
        }

        return categoryDTO.build();
    }

    @Override
    public Category toEntity(CategoryDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Category.CategoryBuilder category = Category.builder();

        category.color( dto.getColor() );
        category.icon( dto.getIcon() );
        category.id( dto.getId() );
        category.name( dto.getName() );
        if ( dto.getType() != null ) {
            category.type( Enum.valueOf( TransactionType.class, dto.getType() ) );
        }

        return category.build();
    }
}
