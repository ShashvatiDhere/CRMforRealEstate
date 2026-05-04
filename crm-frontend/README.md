# Real Estate CRM Frontend

A complete, fully functional React.js frontend for the Real Estate CRM application, connecting to a Spring Boot backend.

## Features

- **Role-Based Access Control**: Separate dashboards and routes for Admin, Manager, and Agent roles.
- **Authentication**: JWT Bearer Token based authentication via Email OTP flow.
- **Modern UI**: Clean, professional design with a custom styling system (CSS Modules + CSS Variables).
- **Interactive Dashboards**: Data visualization and management via responsive tables and forms.

## Technology Stack

- **React 18** (Vite)
- **React Router DOM v6** for routing
- **Axios** for API calls
- **Context API** for auth state management
- **CSS Modules** for isolated styling
- **React Toastify** for notifications
- **Lucide React** for icons

## Getting Started

### Prerequisites

Ensure you have Node.js installed (v16+ recommended).
Ensure the Spring Boot backend is running at `http://localhost:8080`.

### Installation

1. Navigate to the project directory:
   ```bash
   cd crm-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

### API Configuration

The application is configured to proxy API requests to `http://localhost:8080` to avoid CORS issues during development. This is configured in `vite.config.js`.

If your backend is running on a different port or host, update the `target` in `vite.config.js`.

The base Axios instance (`src/api/axiosInstance.js`) points to `/api`.

### Roles & Login Process

- All roles log in using the OTP flow (`/login` -> `/verify-otp`).
- Agents can self-register at `/register` (requires admin approval).
- Admins and Managers are created by higher-level roles.
