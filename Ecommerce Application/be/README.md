# E-commerce Backend API

A robust e-commerce backend API built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Product management with image upload
- Category and brand management
- Shopping cart functionality
- Order processing with payment integration
- Coupon management
- File upload handling
- Error handling and validation
- Rate limiting and security measures

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for image storage
- Stripe for payment processing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Stripe account (for payment processing)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Most routes require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Available Routes

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (Admin)
- `PUT /categories/:id` - Update category (Admin)
- `DELETE /categories/:id` - Delete category (Admin)

#### Brands
- `GET /brands` - Get all brands
- `GET /brands/:id` - Get brand by ID
- `POST /brands` - Create brand (Admin)
- `PUT /brands/:id` - Update brand (Admin)
- `DELETE /brands/:id` - Delete brand (Admin)

#### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)
- `POST /products/:id/ratings` - Add product rating (User)

#### Cart
- `GET /cart` - Get user's cart
- `POST /cart` - Add item to cart
- `PUT /cart/:productId` - Update cart item quantity
- `DELETE /cart/:productId` - Remove item from cart
- `DELETE /cart` - Clear cart
- `POST /cart/apply-coupon` - Apply coupon to cart

#### Orders
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `POST /orders` - Create new order
- `POST /orders/:id/cancel` - Cancel order
- `GET /orders/:id/invoice` - Get order invoice
- `PUT /orders/:id/status` - Update order status (Admin)

#### Coupons
- `GET /coupons` - Get all coupons
- `GET /coupons/:id` - Get coupon by ID
- `POST /coupons` - Create coupon (Admin)
- `PUT /coupons/:id` - Update coupon (Admin)
- `DELETE /coupons/:id` - Delete coupon (Admin)

#### User Management
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/avatar` - Update user avatar
- `PUT /users/change-password` - Change password
- `GET /users` - Get all users (Admin)
- `PUT /users/:id/role` - Update user role (Admin)

### Error Handling

The API uses standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

Common error types:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 500: Internal Server Error

### File Upload

For routes requiring file uploads:
- Use `multipart/form-data` content type
- Field names:
  - `logo` for brand logos
  - `images` for product images (multiple)
  - `avatar` for user avatars

### Rate Limiting

- Public routes: 100 requests per 15 minutes
- Protected routes: 1000 requests per 15 minutes
- Admin routes: 5000 requests per 15 minutes

## Error Handling

The application includes comprehensive error handling:

1. **Validation Errors**
   - Mongoose validation errors
   - Custom validation errors
   - File upload validation

2. **Authentication Errors**
   - Invalid tokens
   - Expired tokens
   - Missing authentication

3. **Database Errors**
   - Duplicate key errors
   - Cast errors
   - Connection errors

4. **File Upload Errors**
   - File size limits
   - File type restrictions
   - Upload failures

5. **Custom API Errors**
   - Operational errors
   - Programming errors
   - Unknown errors

## Development

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
└── app.js          # Application entry point
```

### Scripts

- `npm run dev`: Start development server
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run test`: Run tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 