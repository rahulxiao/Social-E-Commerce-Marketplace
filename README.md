# Social E-commerce Marketplace

A modern e-commerce platform built with NestJS that provides a social shopping experience with separate modules for users, sellers, and administrators.

## 🚀 Project Overview

This is a social e-commerce marketplace backend API built using NestJS framework. The platform is designed to support multiple user roles (users, sellers, and administrators) with a modular architecture for scalability and maintainability.

## 🏗️ Architecture

The project follows a modular architecture with separate modules for different user roles:

- **User Module**: Handles customer operations (viewing products, making purchases, etc.)
- **Seller Module**: Manages seller operations (product management, inventory, etc.)
- **Admin Module**: Provides administrative functions (user management, platform oversight, etc.)

## 📁 Project Structure

```
src/
├── admin/                 # Admin module
│   ├── admin.controller.ts
│   ├── admin.services.ts
│   └── admin.module.ts
├── user/                  # User module
│   ├── user.controller.ts
│   ├── user.services.ts
│   └── user.module.ts
├── seller/                # Seller module (in development)
│   ├── seller.controller.ts
│   ├── seller.services.ts
│   └── seller.module.ts
├── app.module.ts          # Main application module
└── main.ts               # Application entry point
```

## 🛠️ Technology Stack

- **Framework**: NestJS v11.0.1
- **Language**: TypeScript
- **Runtime**: Node.js
- **Package Manager**: npm
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm (v8 or higher)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rahulxiao/Social-E-Commerce-Marketplace.git
cd social-e-commerce-marketplace
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

#### Debug Mode
```bash
npm run start:debug
```

### Testing

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Test watch mode
npm run test:watch
```

## 🌐 API Endpoints

### Admin Endpoints
- `GET /admin/getAdminInfo` - Get admin information
- `POST /admin/createAdmin` - Create a new admin
- `DELETE /admin/deleteAdmin` - Delete an admin

### User Endpoints
- `GET /user/getUserInfo` - Get user information
- `POST /user/createUser` - Create a new user
- `DELETE /user/deleteUser` - Delete a user

### Seller Endpoints
- Currently in development phase

## 🔧 Configuration

The application runs on port 3333 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=3333 npm run start:dev
```

## 📝 Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## 🏗️ Development Status

### ✅ Completed
- Basic NestJS project setup
- Admin module with basic CRUD operations
- User module with basic CRUD operations
- Modular architecture implementation
- Development environment configuration

### 🚧 In Progress
- Seller module implementation
- Database integration
- Authentication and authorization
- API documentation

### 📋 Planned Features
- Product management system
- Order processing
- Payment integration
- Social features (reviews, ratings, etc.)
- Real-time notifications
- Advanced search and filtering
- Mobile API support


## 📄 License

This project is licensed under the UNLICENSED license.


## 🙏 Acknowledgments

- NestJS team for the amazing framework
- The open-source community for various tools and libraries



