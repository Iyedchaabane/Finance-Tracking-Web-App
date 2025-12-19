package com.financetracker.backend.mapper;

import com.financetracker.backend.dto.TransactionDTO;
import com.financetracker.backend.model.Category;
import com.financetracker.backend.model.Transaction;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-19T11:32:33+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class TransactionMapperImpl implements TransactionMapper {

    @Override
    public TransactionDTO toDto(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }

        TransactionDTO.TransactionDTOBuilder transactionDTO = TransactionDTO.builder();

        transactionDTO.transactionCategoryId( transactionCategoryId( transaction ) );
        transactionDTO.transactionCategoryName( transactionCategoryName( transaction ) );
        transactionDTO.transactionCategoryIcon( transactionCategoryIcon( transaction ) );
        transactionDTO.transactionCategoryColor( transactionCategoryColor( transaction ) );
        transactionDTO.amount( transaction.getAmount() );
        transactionDTO.currency( transaction.getCurrency() );
        transactionDTO.date( transaction.getDate() );
        transactionDTO.description( transaction.getDescription() );
        transactionDTO.id( transaction.getId() );
        transactionDTO.type( transaction.getType() );

        return transactionDTO.build();
    }

    @Override
    public Transaction toEntity(TransactionDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Transaction.TransactionBuilder transaction = Transaction.builder();

        transaction.amount( dto.getAmount() );
        transaction.currency( dto.getCurrency() );
        transaction.date( dto.getDate() );
        transaction.description( dto.getDescription() );
        transaction.id( dto.getId() );
        transaction.type( dto.getType() );

        return transaction.build();
    }

    private Long transactionCategoryId(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        Category category = transaction.getCategory();
        if ( category == null ) {
            return null;
        }
        Long id = category.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String transactionCategoryName(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        Category category = transaction.getCategory();
        if ( category == null ) {
            return null;
        }
        String name = category.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String transactionCategoryIcon(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        Category category = transaction.getCategory();
        if ( category == null ) {
            return null;
        }
        String icon = category.getIcon();
        if ( icon == null ) {
            return null;
        }
        return icon;
    }

    private String transactionCategoryColor(Transaction transaction) {
        if ( transaction == null ) {
            return null;
        }
        Category category = transaction.getCategory();
        if ( category == null ) {
            return null;
        }
        String color = category.getColor();
        if ( color == null ) {
            return null;
        }
        return color;
    }
}
