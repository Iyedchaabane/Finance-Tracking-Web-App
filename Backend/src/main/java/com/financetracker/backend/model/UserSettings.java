package com.financetracker.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_settings")
/**
 * Entity representing user preferences and settings for the Finance Tracker
 * application.
 * 
 * This entity stores user-specific configuration including UI theme, currency
 * preference,
 * and language/localization settings. The settings are separate from the User
 * entity
 * to maintain a clean separation of concerns.
 */
public class UserSettings {

    /**
     * Primary key, shared with User entity ID (one-to-one mapping)
     */
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    private String theme = "light";

    /**
     * Currency code (e.g., "USD", "EUR").
     * Validated as a 3-letter uppercase ISO code.
     */
    @jakarta.validation.constraints.NotNull
    @jakarta.validation.constraints.Pattern(regexp = "^[A-Z]{3}$")
    @Builder.Default
    private String currency = "EUR";

    /**
     * Language code (e.g., "en", "ar", "fr").
     * Normalized to lowercase for frontend consistency.
     */
    @jakarta.validation.constraints.NotNull
    @jakarta.validation.constraints.Pattern(regexp = "^[a-z]{2}$")
    @Builder.Default
    private String language = "en";

    /**
     * Right-to-left flag, automatically synced with language selection.
     */
    @Builder.Default
    private boolean isRtl = false;

    @PrePersist
    public void prePersist() {
        normalizeAndSync();
    }

    @PreUpdate
    public void preUpdate() {
        normalizeAndSync();
    }

    /**
     * Internal helper to ensure language is lowercase and isRtl matches the
     * language.
     */
    private void normalizeAndSync() {
        if (this.currency == null) {
            this.currency = "EUR";
        }
        if (this.language == null) {
            this.language = "en";
        } else {
            this.language = this.language.toLowerCase();
        }

        // Logical sync: Arabic is currently our only RTL language
        this.isRtl = "ar".equals(this.language);
    }
}
