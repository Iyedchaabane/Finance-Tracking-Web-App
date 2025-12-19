# Finance Tracker - Frontend

This is the React frontend for the Finance Tracking application, built with Vite and TailwindCSS.

## 🎨 UI/UX Philosophy

-   **Modular Components**: Focused, reusable components for charts, cards, and forms.
-   **Responsive Design**: Mobile-first approach using Tailwind's layout utilities.
-   **Modern Aesthetics**: Vibrant color palettes, smooth transitions, and glassmorphism elements.

## 🏢 Component Structure

-   **Dashboard**: High-level overview with charts (Recharts) and stats cards.
-   **Transactions**: Data table with filtering and search capabilities.
-   **Categories**: Visual card grid with multi-language support and deletion safety.
-   **Settings**: Tabbed interface for appearance, currency, and language.

## 🌐 i18n & Localization

The application uses an internal translation framework supporting **English**, **Arabic**, and **French**.

-   **Dynamic RTL**: Layout direction (LTR/RTL) flips automatically based on the selected language.
-   **Hybrid Translation**: Standard UI text uses translation keys, while categories use a combination of backend-provided keys and user-defined names.
-   **Standard Locales**: Currency and date formatting use standard BCP 47 locales mapped in `currencyUtils.js`.

## ⚡ State Management

-   **FinanceContext**: Centralized store for user profile, transactions, and categories.
-   **Optimistic Updates**: Settings changes are reflected immediately in the UI for a snappy experience.
-   **Automatic Refresh**: Transactions are re-fetched from the backend when a currency change is detected to ensure data consistency.

## 🚀 Setup

1.  `npm install`
2.  `npm run dev`
