# Finance Tracking Web App

Welcome to the **Finance Tracking Web App**, a comprehensive solution for managing your personal finances. This application features a robust Spring Boot backend, a modern React frontend, and a PostgreSQL database.

## 🚀 Key Features

- **Personal Dashboard**: Track your income and expenses with interactive charts.
- **Transaction Management**: Securely add, edit, and delete transactions.
- **Category Support**: Organize your finances with customizable categories and soft-deletion protection.
- **Multi-language & RTL**: Support for English, Arabic, and French, with automatic layout flipping for RTL languages.
- **Currency Conversion**: Real-time currency conversion for global finance management.

---

## 🏗️ Getting Started

Follow these steps to set up and run the project locally.

### 1. Run Database (Docker)

Ensure you have [Docker](https://www.docker.com/) installed and running.

```bash
# Start the PostgreSQL database
docker-compose up -d
```

### 2. Backend Setup (Java/Spring Boot)

The backend is built with **Spring Boot 3.x** and **Java 21**.

#### 2.1 Configure ExchangeRate-API Key

The application uses [ExchangeRate-API](https://www.exchangerate-api.com/) for real-time currency conversion.

1. **Get your free API key**:
   - Visit [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/)
   - Sign up for a free account
   - Copy your API key

2. **Update `application.yml`**:
   - Open `Backend/src/main/resources/application.yml`
   - Replace the placeholder API key with your own:

```yaml
exchange-rate:
  api:
    base-url: https://v6.exchangerate-api.com/v6
    api-key: YOUR_API_KEY_HERE  # Replace with your actual API key
```

#### 2.2 Run the Application

```bash
# Navigate to the backend directory
cd Backend

# Run the application using Maven
mvn spring-boot:run
```

> [!IMPORTANT]
> Ensure you have JDK 21 and Maven installed. The ExchangeRate-API key is required for currency conversion features to work properly.

### 3. Frontend Setup (React/Vite)

The frontend is a **React** application built with **Vite** and **TailwindCSS**.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, TailwindCSS, Recharts, Lucide Icons |
| **Backend** | Java 21, Spring Boot 3, Spring Data JPA, Spring Security (JWT), MapStruct |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose |

---

## 🏢 Architecture

The project follows a clean, modular structure:

- **`/Backend`**: Layered architecture (Controller, Service, Repository, Model) with JWT security and centralized exception handling.
- **`/frontend`**: Component-based React architecture with context-based state management and responsive design.
- **`docker-compose.yml`**: Orchestrates the PostgreSQL database container.

---

### 📄 License
This project is for educational/demo purposes.
