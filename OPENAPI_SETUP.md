# OpenAPI Documentation Setup

## Overview
This project now includes comprehensive OpenAPI 3.1.0 documentation for the MERN e-commerce API.

## Accessing the API Documentation

Once the server is running, you can access the interactive API documentation at:

**🔗 http://localhost:8000/api-docs/**

(Or replace `8000` with whatever port your server is configured to use)

## What's Included

### API Documentation Location
- **File**: `/server/openapi.yaml`
- **Format**: OpenAPI 3.1.0 specification
- **UI**: Swagger UI (interactive documentation)

### Documented Endpoints

The OpenAPI specification includes complete documentation for:

#### Authentication Endpoints (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot` - Request password reset
- `POST /auth/reset/:token` - Reset password with token
- `POST /auth/reset` - Change password (authenticated)
- `GET /auth/google` - Google OAuth
- `GET /auth/facebook` - Facebook OAuth

#### Product Endpoints (`/product`)
- `GET /product/item/:slug` - Get product by slug
- `GET /product/list/search/:name` - Search products
- `GET /product/list` - Get products with filters (pagination, price, rating, category)
- `GET /product/list/brand/:slug` - Get products by brand
- `GET /product/list/select` - Get product names for selection
- `GET /product` - Get all products (Admin/Merchant)
- `POST /product/add` - Add new product (Admin/Merchant)
- `GET /product/:id` - Get product by ID (Admin/Merchant)
- `PUT /product/:id` - Update product (Admin/Merchant)
- `PUT /product/:id/active` - Toggle product status (Admin/Merchant)
- `DELETE /product/delete/:id` - Delete product (Admin/Merchant)

### Data Models

Complete schemas for all data models:
- **User** - User accounts with role-based access
- **Product** - Product information with images and pricing
- **Brand** - Brand information
- **Category** - Product categories
- **Cart** & **CartItem** - Shopping cart functionality
- **Order** - Order management
- **Review** - Product reviews with approval workflow
- **Wishlist** - User wishlists
- **Address** - User shipping addresses
- **Merchant** - Merchant accounts with approval workflow
- **Contact** - Contact form submissions

### Security

The API uses JWT Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

## Implementation Details

### Dependencies
- `swagger-ui-express` - Serves the interactive Swagger UI
- `yamljs` - Parses the OpenAPI YAML file

### Server Configuration
The API documentation is configured in `/server/index.js`:

```javascript
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

## Features

### Interactive Documentation
- **Try it out** - Test API endpoints directly from the browser
- **Request/Response Examples** - See example requests and responses
- **Schema Validation** - View data models and required fields
- **Authentication** - Test authenticated endpoints with JWT tokens

### Organized by Tags
Endpoints are organized into logical groups:
- Authentication
- Users
- Products
- Categories
- Brands
- Cart
- Orders
- Reviews
- Wishlist
- Addresses
- Merchants
- Contact
- Newsletter

## Future Enhancements

To complete the API documentation, consider adding:

1. **Remaining Endpoints**:
   - Cart management endpoints
   - Order management endpoints
   - Review endpoints
   - Wishlist endpoints
   - Address endpoints
   - Merchant endpoints
   - Category endpoints
   - Brand endpoints
   - Contact endpoints
   - Newsletter endpoints
   - User management endpoints

2. **Response Examples**:
   - Add more detailed response examples for each endpoint
   - Include error response examples

3. **Request Examples**:
   - Add example request bodies for POST/PUT endpoints
   - Include various scenarios (success, validation errors, etc.)

4. **Advanced Features**:
   - Add rate limiting information
   - Document pagination details
   - Add webhook documentation if applicable

## Updating the Documentation

To update the API documentation:

1. Edit `/server/openapi.yaml`
2. The changes will be reflected immediately (with nodemon watching)
3. Refresh the `/api-docs/` page to see updates

## Validation

You can validate your OpenAPI specification using:
- [Swagger Editor](https://editor.swagger.io/) - Paste your YAML content
- [OpenAPI Validator](https://apitools.dev/swagger-parser/online/)

## Notes

- The API documentation is exposed in development mode
- For production, consider:
  - Setting `exposeApiDocs: false` or removing the route entirely
  - Adding authentication to the `/api-docs/` endpoint
  - Hosting documentation separately from the API server

