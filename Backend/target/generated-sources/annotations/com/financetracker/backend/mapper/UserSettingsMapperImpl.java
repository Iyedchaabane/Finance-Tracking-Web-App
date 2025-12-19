package com.financetracker.backend.mapper;

import com.financetracker.backend.dto.UserSettingsDTO;
import com.financetracker.backend.model.UserSettings;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-19T11:32:32+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class UserSettingsMapperImpl implements UserSettingsMapper {

    @Override
    public UserSettingsDTO toDto(UserSettings userSettings) {
        if ( userSettings == null ) {
            return null;
        }

        UserSettingsDTO.UserSettingsDTOBuilder userSettingsDTO = UserSettingsDTO.builder();

        userSettingsDTO.currency( userSettings.getCurrency() );
        userSettingsDTO.language( userSettings.getLanguage() );
        userSettingsDTO.theme( userSettings.getTheme() );

        return userSettingsDTO.build();
    }

    @Override
    public UserSettings toEntity(UserSettingsDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserSettings.UserSettingsBuilder userSettings = UserSettings.builder();

        userSettings.currency( dto.getCurrency() );
        userSettings.language( dto.getLanguage() );
        userSettings.theme( dto.getTheme() );

        return userSettings.build();
    }
}
