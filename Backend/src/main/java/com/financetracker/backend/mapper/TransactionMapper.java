package com.financetracker.backend.mapper;

import com.financetracker.backend.dto.TransactionDTO;
import com.financetracker.backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(source = "category.id", target = "transactionCategoryId")
    @Mapping(source = "category.name", target = "transactionCategoryName")
    @Mapping(source = "category.icon", target = "transactionCategoryIcon")
    @Mapping(source = "category.color", target = "transactionCategoryColor")
    TransactionDTO toDto(Transaction transaction);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "category", ignore = true) // Handled manually in service
    Transaction toEntity(TransactionDTO dto);
}
