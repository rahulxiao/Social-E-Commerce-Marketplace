# Social E-commerce Marketplace

A modern e-commerce platform built with NestJS that provides a social shopping experience with separate modules for buyers, sellers, administrators, products, cart, and orders.

## 🚀 Project Overview

This is a social e-commerce marketplace backend API built using NestJS framework with TypeORM and PostgreSQL. The platform is designed to support multiple user roles (buyers, sellers, and administrators) with a modular architecture for scalability and maintainability.

## 🏗️ Architecture

The project follows a modular architecture with separate modules for different functionalities:

- **Admin Module**: Handles administrative functions with User Category 4 requirements (✅ Complete)
- **Buyer Module**: Manages customer operations with User Category 2 & 3 requirements (✅ Complete)
- **Seller Module**: Handles seller operations (product management, inventory, etc.)
- **Product Module**: Manages product catalog and inventory
- **Cart Module**: Handles shopping cart operations
- **Order Module**: Manages order processing and tracking

## 📁 Project Structure

```
src/
├── admin/                 # Admin module (✅ Complete with User Category 4)
│   ├── admin.entity.ts    # Database entity with UUID generation, validation
│   ├── admin.controller.ts # RESTful endpoints with validation
│   ├── admin.services.ts  # Business logic with TypeORM integration
│   ├── admin.dto.ts       # Data transfer objects with validation
│   └── admin.module.ts    # Module configuration
├── buyer/                 # Buyer module (✅ Complete with User Category 2 & 3)
│   ├── buyer.entity.ts    # Database entity with custom ID generation
│   ├── buyer.controller.ts # RESTful endpoints with file upload
│   ├── buyer.services.ts  # Business logic with TypeORM integration
│   ├── buyer.dto.ts       # Data transfer objects with validation
│   └── buyer.module.ts    # Module configuration
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
└── main.ts               # Application entry point with global validation
```

## 🛠️ Technology Stack

- **Framework**: NestJS v11.0.1
- **Language**: TypeScript
- **Runtime**: Node.js v22.17.0
- **Database**: PostgreSQL with TypeORM
- **Package Manager**: npm
- **Validation**: class-validator with global ValidationPipe
- **File Upload**: Multer with PDF validation
- **UUID Generation**: uuid library
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

3. Install additional dependencies:
```bash
npm install uuid @types/uuid
```

4. Configure database:
   - Create a PostgreSQL database named `trendora`
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

### Admin Endpoints (✅ Complete with User Category 4)
- `POST /admin/create` - Create a new admin with UUID generation
- `PUT /admin/updateCountry/:id` - Update admin country
- `GET /admin/byJoiningDate?date=YYYY-MM-DD` - Get admins by joining date
- `GET /admin/defaultCountry` - Get admins with default country ('Unknown')
- `GET /admin/all` - Get all admins
- `GET /admin/getAdminInfo` - Get all admin information (Legacy)
- `POST /admin/createAdmin` - Create admin (Legacy)
- `GET /admin/getAdminById/:id` - Get admin by ID
- `PUT /admin/updateAdmin/:id` - Update admin information
- `DELETE /admin/deleteAdminById/:id` - Delete admin by ID

### Buyer Endpoints (✅ Complete with User Category 2 & 3)
- `POST /buyer/create` - Create a new buyer with custom ID generation
- `PUT /buyer/updatePhone/:id` - Update buyer phone number
- `GET /buyer/nullFullName` - Get buyers with null full name
- `DELETE /buyer/remove/:id` - Remove buyer by ID
- `GET /buyer/all` - Get all buyers
- `GET /buyer/get/:id` - Get buyer by ID
- `PUT /buyer/update/:id` - Update buyer information
- `POST /buyer/upload` - Upload PDF file (PDF validation)
- `GET /buyer/getfile/:name` - Get uploaded file
- `GET /buyer/getBuyerInfo` - Get buyer information (Legacy)
- `POST /buyer/createBuyer` - Create buyer (Legacy)
- `POST /buyer/updateBuyer` - Update buyer (Legacy)

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

#### **Admin Module (User Category 4)**
- **Entity**: Complete with UUID generation, joining date, country fields
- **Validation**: Name (letters only), email, phone, password requirements
- **Operations**: Create, update country, retrieve by joining date, get default country
- **Features**: Auto-generated UUID, timestamp joining date, default country value
- **Database Integration**: Full TypeORM integration with PostgreSQL

#### **Buyer Module (User Category 2 & 3)**
- **Entity**: Complete with custom ID generation, nullable full name, phone validation
- **Validation**: 
  - Name (no special characters)
  - Password (min 6 chars, one lowercase)
  - Phone (must start with "01")
  - File upload (PDF only)
- **Operations**: Create, update phone, retrieve null full names, remove by ID
- **Features**: Custom ID generation, file upload with PDF validation
- **Database Integration**: Full TypeORM integration with PostgreSQL

#### **Core Infrastructure**
- **Global Validation**: ValidationPipe with whitelist and transform options
- **File Upload**: Multer integration with PDF validation
- **Error Handling**: Comprehensive error handling with try-catch blocks
- **Database Integration**: TypeORM with PostgreSQL and auto-synchronization
- **Modular Architecture**: Clean separation of concerns

### 🔄 In Progress
- **Seller Module**: Basic CRUD operations (needs database integration)
- **Product Module**: Basic CRUD operations (needs database integration)
- **Cart Module**: Basic implementation (needs database integration)
- **Order Module**: Basic implementation (needs database integration)

### 📋 Planned Features
- **Authentication and Authorization**: JWT-based authentication
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
    uniqueId VARCHAR(150) UNIQUE NOT NULL, -- Auto-generated UUID
    name VARCHAR(100) NOT NULL, -- Letters and spaces only
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(200) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL, -- Letters, numbers, underscore only
    password VARCHAR(100) NOT NULL, -- Min 6 chars, one lowercase, one special char
    joiningDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    country VARCHAR(30) DEFAULT 'Unknown',
    dateOfBirth DATE NOT NULL,
    socialMediaLink VARCHAR(200) NOT NULL, -- GitHub, Facebook, LinkedIn, Twitter only
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Buyer Table (✅ Implemented)
```sql
CREATE TABLE buyer (
    id BIGINT PRIMARY KEY, -- Custom generated ID
    isActive BOOLEAN DEFAULT true,
    fullName VARCHAR(100) NULL, -- Nullable, letters and spaces only
    phone VARCHAR(20) NOT NULL, -- Must start with "01"
    bemail VARCHAR(255) UNIQUE NOT NULL,
    busername VARCHAR(50) UNIQUE NOT NULL,
    bpassword VARCHAR(255) NOT NULL, -- Min 6 chars, one lowercase
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Planned Tables
- **seller**: Seller information and store details
- **product**: Product catalog with categories
- **cart**: Shopping cart items
- **order**: Order information and status
- **order_item**: Individual items in orders
- **post**: Social posts and interactions
- **review**: Product reviews and ratings

## 🚀 Quick Start Examples

### Create an Admin (User Category 4)
```bash
curl -X POST http://localhost:3333/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "john.admin@example.com",
    "phone": "1234567890",
    "address": "123 Admin Street, City, State 12345",
    "username": "johnadmin",
    "password": "admin@123",
    "country": "USA",
    "dateOfBirth": "1990-05-15",
    "socialMediaLink": "https://github.com/johnadmin"
  }'
```

### Create a Buyer (User Category 2)
```bash
curl -X POST http://localhost:3333/buyer/create \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "01123456789",
    "bemail": "john.doe@example.com",
    "busername": "johndoe123",
    "bpassword": "password123",
    "isActive": true
  }'
```

### Get Buyers with Null Full Name
```bash
curl -X GET http://localhost:3333/buyer/nullFullName
```

### Get Admins by Joining Date
```bash
curl -X GET "http://localhost:3333/admin/byJoiningDate?date=2024-01-01"
```

## 📋 Validation Rules

### Admin Validation (User Category 4)
- **Name**: Letters and spaces only (no numbers or special characters)
- **Username**: Letters, numbers, and underscores only (no special characters)
- **Password**: Minimum 6 characters, one lowercase letter, one special character (@#$&)
- **Social Media**: Only GitHub, Facebook, LinkedIn, or Twitter URLs allowed
- **UniqueId**: Auto-generated UUID (v4) format
- **Joining Date**: Auto-generated timestamp
- **Country**: Defaults to 'Unknown'

### Buyer Validation (User Category 2 & 3)
- **Full Name**: Letters and spaces only (nullable, no special characters)
- **Phone**: Must start with "01" and contain only digits
- **Password**: Minimum 6 characters, at least one lowercase letter
- **File Upload**: Only PDF files allowed (extension and MIME type validation)
- **ID**: Custom generated using timestamp + random number

## 📁 Postman Collections

The project includes comprehensive Postman collections for testing:

- **Admin_API_Collection.json**: Complete admin API testing with User Category 4 scenarios
- **buyer-api-postman.json**: Complete buyer API testing with User Category 2 & 3 scenarios

Both collections include:
- Valid and invalid test cases
- Error handling scenarios
- File upload testing
- Validation testing
- Legacy endpoint compatibility

## 📄 License

This project is licensed under the UNLICENSED license.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM team for excellent database integration
- The open-source community for various tools and libraries



