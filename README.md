# Social E-commerce Marketplace

A modern e-commerce platform built with NestJS that provides a social shopping experience with separate modules for buyers, sellers, administrators, products, cart, and orders.

## 🚀 Project Overview

This is a social e-commerce marketplace backend API built using NestJS framework with TypeORM and PostgreSQL. The platform is designed to support multiple user roles (buyers, sellers, and administrators) with a modular architecture for scalability and maintainability.

## 🏗️ Architecture

The project follows a modular architecture with separate modules for different functionalities:

- **Admin Module**: Handles administrative functions (user management, platform oversight, etc.)
- **Buyer Module**: Manages customer operations (viewing products, making purchases, social features)
- **Seller Module**: Handles seller operations (product management, inventory, etc.)
- **Product Module**: Manages product catalog and inventory
- **Cart Module**: Handles shopping cart operations
- **Order Module**: Manages order processing and tracking

## 📁 Project Structure

```
src/
├── admin/                 # Admin module (✅ Complete)
│   ├── admin.entity.ts    # Database entity with validation
│   ├── admin.controller.ts
│   ├── admin.services.ts
│   ├── admin.dto.ts       # Data transfer objects
│   └── admin.module.ts
├── buyer/                 # Buyer module (🔄 Basic implementation)
│   ├── buyer.controller.ts
│   ├── buyer.services.ts
│   └── buyer.module.ts
├── seller/                # Seller module (🔄 Basic implementation)
│   ├── seller.controller.ts
│   ├── seller.services.ts
│   └── seller.module.ts
├── product/               # Product module (🔄 Basic implementation)
│   ├── product.controller.ts
│   ├── product.service.ts
│   └── product.module.ts
├── cart/                  # Cart module (🔄 Basic implementation)
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── cart.module.ts
├── order/                 # Order module (🔄 Basic implementation)
│   ├── order.controller.ts
│   ├── order.service.ts
│   └── order.module.ts
├── app.module.ts          # Main application module
└── main.ts               # Application entry point
```

## 🛠️ Technology Stack

- **Framework**: NestJS v11.0.1
- **Language**: TypeScript
- **Runtime**: Node.js v22.17.0
- **Database**: PostgreSQL with TypeORM
- **Package Manager**: npm
- **Validation**: class-validator
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v18 or higher)
- npm (v8 or higher)
- PostgreSQL (v12 or higher)
- pgAdmin (for database management)

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

3. Configure database:
   - Create a PostgreSQL database named `greenguest`
   - Update database credentials in `src/app.module.ts` if needed

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

The application runs on port 3333 by default.

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

### Admin Endpoints (✅ Complete with Database Integration)
- `GET /admin/getAdminInfo` - Get all admin information
- `POST /admin/createAdmin` - Create a new admin
- `GET /admin/getAdminById/:id` - Get admin by ID
- `PUT /admin/updateAdmin/:id` - Update admin information
- `DELETE /admin/deleteAdmin` - Delete all admins
- `DELETE /admin/deleteAdminById/:id` - Delete admin by ID
- `POST /admin/addAdminBody` - Test endpoint for admin creation
- `GET /admin/getAdminInfoByNameAndId` - Get admin by name and ID

### Buyer Endpoints (🔄 Basic Implementation)
- `GET /user/getUserInfo` - Get user information
- `POST /user/createUser` - Create a new user
- `DELETE /user/deleteUser` - Delete a user
- `POST /user/createPost` - Create a social post
- `GET /user/getPosts` - Get all posts
- `DELETE /user/deletePost/:postId` - Delete a post
- `POST /user/likePost/:postId` - Like a post
- `POST /user/unlikePost/:postId` - Unlike a post
- `POST /user/follow/:userId` - Follow a user
- `POST /user/unfollow/:userId` - Unfollow a user

### Seller Endpoints (🔄 Basic Implementation)
- `GET /seller/getSellerInfo` - Get seller information
- `GET /seller/getSellerById` - Get seller by ID
- `POST /seller/CreateSeller` - Create a new seller
- `POST /seller/updateSeller` - Update seller information
- `DELETE /seller/deleteSeller` - Delete a seller

### Product Endpoints (🔄 Basic Implementation)
- `POST /product/createProduct` - Create a new product
- `GET /product/getProductInfo` - Get product information
- `GET /product/products` - Browse all products
- `GET /product/getProductsByCategory/:category` - Get products by category
- `GET /product/getProductById/:id` - Get product by ID
- `PUT /product/updateProduct` - Update product information
- `DELETE /product/deleteProduct` - Delete all products
- `DELETE /product/deleteProductById/:id` - Delete product by ID

### Cart Endpoints (🔄 Basic Implementation)
- `POST /cart/add` - Add item to cart

### Order Endpoints (🔄 Basic Implementation)
- `POST /orders` - Place a new order
- `GET /orders` - Get all orders

## 🔧 Configuration

### Database Configuration
The application is configured to connect to PostgreSQL with the following settings:
- **Host**: localhost
- **Port**: 5432
- **Database**: trendora
- **Username**: postgres
- **Password**: rahulxiao
- **Synchronize**: true (auto-creates tables)

### Environment Variables
You can customize the application by setting environment variables:
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
- **Admin Module**: Full CRUD operations with database integration
  - Entity with validation decorators
  - Service with TypeORM integration
  - Controller with RESTful endpoints
  - DTOs for request validation
  - Database table creation and data persistence
- Basic NestJS project setup
- Modular architecture implementation
- Development environment configuration
- Database integration with PostgreSQL
- TypeORM configuration with auto-synchronization

### 🔄 In Progress
- **Buyer Module**: Basic CRUD operations (needs database integration)
- **Seller Module**: Basic CRUD operations (needs database integration)
- **Product Module**: Basic CRUD operations (needs database integration)
- **Cart Module**: Basic implementation (needs database integration)
- **Order Module**: Basic implementation (needs database integration)

### 📋 Planned Features
- **Database Integration**: Complete TypeORM entities for all modules
- **Authentication and Authorization**: JWT-based authentication
- **Data Validation**: Complete DTO validation for all modules
- **Social Features**: Enhanced social interactions
- **Product Management**: Complete product catalog system
- **Order Processing**: Full order lifecycle management
- **Payment Integration**: Payment gateway integration
- **Real-time Notifications**: WebSocket implementation
- **Advanced Search and Filtering**: Elasticsearch integration
- **Mobile API Support**: Mobile-optimized endpoints
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Comprehensive test coverage
- **Deployment**: Docker containerization

## 🗄️ Database Schema

### Admin Table (✅ Implemented)
```sql
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Planned Tables
- **buyer**: Customer information and preferences
- **seller**: Seller information and store details
- **product**: Product catalog with categories
- **cart**: Shopping cart items
- **order**: Order information and status
- **order_item**: Individual items in orders
- **post**: Social posts and interactions
- **review**: Product reviews and ratings

## 🚀 Quick Start Example

### Create an Admin
```bash
curl -X POST http://localhost:3333/admin/createAdmin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "1234567890",
    "address": "123 Admin St",
    "username": "adminuser",
    "password": "password123"
  }'
```

### Get All Admins
```bash
curl -X GET http://localhost:3333/admin/getAdminInfo
```

## 📄 License

This project is licensed under the UNLICENSED license.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM team for excellent database integration
- The open-source community for various tools and libraries



