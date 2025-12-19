package com.financetracker.backend.mapper;

import com.financetracker.backend.dto.UserSettingsDTO;
import com.financetracker.backend.model.UserSettings;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for converting between UserSettings entity and
 * UserSettingsDTO.
 * Ensures clean separation between persistence model and data transfer objects.
 */
@Mapper(componentModel = "spring")
public interface UserSettingsMapper {
    UserSettingsDTO toDto(UserSettings userSettings);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isRtl", ignore = true)
    UserSettings toEntity(UserSettingsDTO dto);
}
