# 🚀 Social E-Commerce Marketplace - API Routes & File Structure

## 📋 Complete API Routes Documentation

### 🔐 **Admin Module** (`/admin`)
**Status: ✅ Complete Implementation**

#### **User Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/admin/create` | Create new admin with UUID generation | ✅ |
| `POST` | `/admin/createAdmin` | Legacy admin creation endpoint | ✅ |
| `GET` | `/admin/all` | Get all admins | ✅ |
| `GET` | `/admin/getAdminById/:id` | Get admin by ID | ✅ |
| `GET` | `/admin/getAdminInfo` | Get all admin information (legacy) | ✅ |
| `GET` | `/admin/getAdminInfoByNameAndId` | Get admin by name and ID | ✅ |
| `PUT` | `/admin/updateAdmin/:id` | Update admin information | ✅ |
| `PUT` | `/admin/updateCountry/:id` | Update admin country | ✅ |
| `DELETE` | `/admin/deleteAdminById/:id` | Delete admin by ID | ✅ |
| `POST` | `/admin/addAdminBody` | Add admin with minimal data | ✅ |

#### **Specialized Admin Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/admin/byJoiningDate?date=YYYY-MM-DD` | Get admins by joining date | ✅ |
| `GET` | `/admin/defaultCountry` | Get admins with default country | ✅ |

---

### 👤 **Buyer Module** (`/buyer`)
**Status: ✅ Complete Implementation**

#### **User Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/buyer/create` | Create new buyer with custom ID | ✅ |
| `POST` | `/buyer/createBuyer` | Legacy buyer creation endpoint | ✅ |
| `GET` | `/buyer/all` | Get all buyers | ✅ |
| `GET` | `/buyer/get/:id` | Get buyer by ID | ✅ |
| `GET` | `/buyer/getByUuid/:uniqueId` | Get buyer by UUID | ✅ |
| `GET` | `/buyer/getBuyerInfo` | Get buyer information (legacy) | ✅ |
| `PUT` | `/buyer/update/:id` | Update buyer information | ✅ |
| `POST` | `/buyer/updateBuyer` | Legacy buyer update endpoint | ✅ |
| `PUT` | `/buyer/updatePhone/:id` | Update buyer phone number | ✅ |
| `DELETE` | `/buyer/remove/:id` | Remove buyer by ID | ✅ |
| `DELETE` | `/buyer/deleteBuyer` | Legacy buyer deletion endpoint | ✅ |

#### **Social Features Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/buyer/createPost` | Create a new post | 🔄 Placeholder |
| `GET` | `/buyer/getPosts` | Get all posts | 🔄 Placeholder |
| `DELETE` | `/buyer/deletePost/:postId` | Delete a post | 🔄 Placeholder |
| `POST` | `/buyer/likePost/:postId` | Like a post | 🔄 Placeholder |
| `POST` | `/buyer/unlikePost/:postId` | Unlike a post | 🔄 Placeholder |
| `POST` | `/buyer/follow/:buyerId` | Follow another buyer | 🔄 Placeholder |
| `POST` | `/buyer/unfollow/:buyerId` | Unfollow another buyer | 🔄 Placeholder |

#### **File Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/buyer/upload` | Upload PDF file (500KB limit) | ✅ |
| `GET` | `/buyer/getfile/:name` | Download uploaded file | ✅ |

#### **Specialized Buyer Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/buyer/nullFullName` | Get buyers with null full names | ✅ |

---

### 🏪 **Seller Module** (`/seller`)
**Status: ✅ Complete Implementation**

#### **User Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/seller/createSeller` | Create new seller with NID image | ✅ |
| `GET` | `/seller/getSellerInfo` | Get all seller information | ✅ |
| `GET` | `/seller/getSellerById/:id` | Get seller by ID | ✅ |
| `GET` | `/seller/getSellerInfoByNameAndId` | Get seller by name and ID | ✅ |
| `PUT` | `/seller/updateSeller/:id` | Update seller information | ✅ |
| `DELETE` | `/seller/deleteSellerById/:id` | Delete seller by ID | ✅ |

#### **Specialized Seller Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `PATCH` | `/seller/updateStatus/:id` | Update seller status | ✅ |
| `GET` | `/seller/getInactiveSellers` | Get inactive sellers | ✅ |
| `GET` | `/seller/getSellersAboveAge?age=40` | Get sellers above specific age | ✅ |

---

### 📦 **Product Module** (`/product`)
**Status: ❌ Minimal Implementation - Placeholder Methods Only**

#### **Product Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/product/createProduct` | Create new product | ❌ Placeholder |
| `GET` | `/product/getProductInfo` | Get product information | ❌ Placeholder |
| `GET` | `/product/products` | Browse all products | ❌ Placeholder |
| `GET` | `/product/getProductById/:id` | Get product by ID | ❌ Placeholder |
| `GET` | `/product/getProductsByCategory/:category` | Get products by category | ❌ Placeholder |
| `PUT` | `/product/updateProduct` | Update product information | ❌ Placeholder |
| `DELETE` | `/product/deleteProduct` | Delete all products | ❌ Placeholder |
| `DELETE` | `/product/deleteProductById/:id` | Delete product by ID | ❌ Placeholder |

---

### 🛒 **Cart Module** (`/cart`)
**Status: ❌ Minimal Implementation - Placeholder Methods Only**

#### **Cart Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/cart/add` | Add item to cart | ❌ Placeholder |

---

### 📋 **Order Module** (`/orders`)
**Status: ❌ Minimal Implementation - Placeholder Methods Only**

#### **Order Management Routes**
| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `POST` | `/orders` | Place a new order | ❌ Placeholder |
| `GET` | `/orders` | Get all orders | ❌ Placeholder |

---

## 🏗️ **Complete File Structure**

```
src/
├── 📁 admin/                          # ✅ Complete Implementation
│   ├── 📄 admin.controller.ts         # 11 API endpoints
│   ├── 📄 admin.dto.ts               # Data validation & transfer
│   ├── 📄 admin.entity.ts            # Database model with UUID
│   ├── 📄 admin.module.ts            # Module configuration
│   └── 📄 admin.services.ts          # Business logic (285 lines)
│
├── 📁 buyer/                          # ✅ Complete Implementation
│   ├── 📄 buyer.controller.ts         # 18 API endpoints
│   ├── 📄 buyer.dto.ts               # Data validation & transfer
│   ├── 📄 buyer.entity.ts            # Database model with custom ID
│   ├── 📄 buyer.module.ts            # Module configuration
│   └── 📄 buyer.services.ts          # Business logic (191 lines)
│
├── 📁 seller/                         # ✅ Complete Implementation
│   ├── 📄 seller.controller.ts        # 8 API endpoints
│   ├── 📄 seller.dto.ts              # Data validation & transfer
│   ├── 📄 seller.entity.ts           # Database model with NID
│   ├── 📄 seller.module.ts           # Module configuration
│   └── 📄 seller.services.ts         # Business logic (246 lines)
│
├── 📁 product/                        # ❌ Minimal Implementation
│   ├── 📄 product.controller.ts       # 8 API endpoints (placeholders)
│   ├── 📄 product.module.ts          # Module configuration
│   └── 📄 product.service.ts         # Placeholder methods (30 lines)
│
├── 📁 cart/                           # ❌ Minimal Implementation
│   ├── 📄 cart.controller.ts          # 1 API endpoint (placeholder)
│   ├── 📄 cart.module.ts             # Module configuration
│   └── 📄 cart.service.ts            # Placeholder methods (9 lines)
│
├── 📁 order/                          # ❌ Minimal Implementation
│   ├── 📄 order.controller.ts         # 2 API endpoints (placeholders)
│   ├── 📄 order.module.ts            # Module configuration
│   └── 📄 order.service.ts           # Placeholder methods (12 lines)
│
├── 📄 app.module.ts                   # Main application module
└── 📄 main.ts                         # Application bootstrap
```

---

## 📊 **API Endpoints Summary**

### **Total Routes: 56**
- **Admin Module**: 11 routes ✅
- **Buyer Module**: 18 routes ✅
- **Seller Module**: 8 routes ✅
- **Product Module**: 8 routes ❌ (placeholders)
- **Cart Module**: 1 route ❌ (placeholder)
- **Order Module**: 2 routes ❌ (placeholders)

### **Implementation Status**
- **✅ Fully Implemented**: 37 routes (66%)
- **❌ Placeholder Only**: 19 routes (34%)
- **🔄 In Progress**: 0 routes

---

## 🔧 **Technical Implementation Details**

### **Database Entities**
- **Admin**: UUID generation, validation, joining date tracking
- **Buyer**: Custom ID generation, social features, file uploads
- **Seller**: NID verification, age filtering, status management
- **Product**: ❌ No entity defined
- **Cart**: ❌ No entity defined
- **Order**: ❌ No entity defined

### **File Upload Support**
- **Admin**: No file upload
- **Buyer**: PDF upload (500KB limit, PDF validation)
- **Seller**: NID image upload (2MB limit, image validation)

### **Validation & Security**
- **Global Validation**: ValidationPipe with whitelist and transform
- **Input Sanitization**: Regex patterns for names, emails, passwords
- **File Validation**: MIME type and extension checking
- **Database Constraints**: Unique constraints, foreign keys

---

## 🚀 **Next Development Priorities**

### **Phase 1: Core E-Commerce (High Priority)**
1. **Product Entity & CRUD** - Complete product management
2. **Cart Entity & Operations** - Shopping cart functionality
3. **Order Entity & Processing** - Order management system

### **Phase 2: Enhanced Features (Medium Priority)**
4. **Authentication System** - JWT implementation
5. **Payment Integration** - Payment gateway setup
6. **Social Features** - Complete social interactions

### **Phase 3: Advanced Features (Low Priority)**
7. **Search & Filtering** - Product search capabilities
8. **Analytics & Reporting** - Business intelligence
9. **API Documentation** - Swagger/OpenAPI setup

---

## 📝 **Notes**

- **Admin Module**: Most comprehensive implementation with 11 endpoints
- **Buyer Module**: Largest module with 18 endpoints including social features
- **Seller Module**: Complete CRUD with specialized filtering capabilities
- **Product/Cart/Order**: Only placeholder implementations exist
- **File Uploads**: Implemented for buyer (PDF) and seller (NID images)
- **Database**: PostgreSQL with TypeORM, auto-synchronization enabled
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Try-catch blocks with structured error responses
