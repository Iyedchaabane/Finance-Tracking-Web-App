# Finance Tracker - Backend

This is the Spring Boot backend for the Finance Tracking application. It provides a secure, RESTful API for managing transactions, categories, and user preferences.

## 🏗️ Architecture

The backend follows a **Layered Architecture** pattern:

1.  **Controller Layer**: Handles HTTP requests and validates input using Jakarta Validation.
2.  **Service Layer**: Encapsulates business logic (Currency conversion, Categorization, User settings).
3.  **Repository Layer**: Interacts with the PostgreSQL database using Spring Data JPA.
4.  **Model Layer**: Represents JPA entities and database relationships.
5.  **Security Layer**: Manages JWT-based authentication and authorization.

### Key Components

-   **`CurrencyConversionService`**: Integrates with ExchangeRate-API to provide real-time currency conversion rates.
-   **`LanguageService`**: Centralizes language metadata, validation, and RTL direction logic.
-   **`CategoryService`**: Implements soft deletion by reassigning transactions to an archive category.
-   **`UserSettingsService`**: Manages user-specific preferences and triggers side effects (like data conversion) upon currency changes.

## 🔒 Security

-   **JWT Authentication**: Stateless authentication using secure JSON Web Tokens.
-   **Global Exception Handling**: Centralized controller advice for consistent API error responses.
-   **Role-Based Access**: Currently supports basic authenticated user access to own data.

## 🛠️ Data Handling

-   **Soft Deletion**: Categories are never permanently deleted from the database to preserve historical report integrity.
-   **DTO Pattern**: MapStruct is used for efficient, type-safe mapping between Entities and Data Transfer Objects.
-   **Normalization**: User settings (language codes) are normalized to lowercase for frontend consistency.

## 🧪 Development

### Configuration
Update `src/main/resources/application.yml` with:
-   Database URL/Credentials
-   JWT Secret
-   ExchangeRate-API Key

### Prerequisites
- JDK 21
- Maven
- PostgreSQL
