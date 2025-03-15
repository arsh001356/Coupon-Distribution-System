# Round-Robin Coupon Distribution System

A web application that distributes coupons to guest users in a round-robin manner with an admin panel to manage coupons and prevent abuse.

## Features

- **Coupon Distribution**: Assigns coupons sequentially to users without repetition
- **Guest User Access**: Users can claim coupons without logging in
- **Abuse Prevention**: IP and cookie-based tracking to prevent multiple claims
- **Admin Panel**: Secure management of coupons and viewing claim history

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Express.js, MongoDB
- **Authentication**: JWT for admin authentication

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd coupon-distribution-system
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the server directory with the following variables:
     ```
     MONGODB_URI=/coupon-system
     JWT_SECRET=your_jwt_secret_key
     CLIENT_URL=http://localhost:5174
     PORT=3000
     ```

4. Create admin user:
   ```
   cd server
   npm run setup
   ```

5. Start the application:
   ```
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend (from client directory)
   npm run dev
   ```

6. Access the application:
   - Frontend: http://localhost:5174
   - Admin login: http://localhost:5174/admin/login
     - Username: admin
     - Password: admin123

## Implementation Details

### Coupon Distribution

Coupons are distributed in a round-robin fashion, ensuring each user gets a unique coupon. The system tracks claims using both IP addresses and browser sessions to prevent abuse.

### Admin Panel

The admin panel provides the following functionality:
- View all coupons and their status
- Add new coupons
- Activate/deactivate coupons
- View claim history with IP and session information

### Security Measures

- JWT authentication for admin access
- IP tracking to prevent multiple claims
- Cookie-based session tracking
- Cooldown period between claims (24 hours)

## API Endpoints

### Public Endpoints
- `POST /api/coupons/claim` - Claim a coupon

### Admin Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status
- `GET /api/coupons` - Get all coupons
- `POST /api/coupons` - Add a new coupon
- `PUT /api/coupons/:id` - Update a coupon
- `DELETE /api/coupons/:id` - Delete a coupon
- `GET /api/coupons/claims` - Get claim history

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure the CLIENT_URL in your .env file matches the actual URL of your frontend application.

### MongoDB Connection
If you have issues connecting to MongoDB, verify that your MongoDB instance is running and that the connection string in your .env file is correct.

### JWT Authentication
If you experience authentication issues, check that your JWT_SECRET is properly set in the .env file and that cookies are being properly sent and received.

## Deployment

For production deployment:

1. Build the frontend:
   ```
   cd client
   npm run build
   ```

2. Set environment variables for production:
   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-production-domain.com
   PORT=8080
   ```

3. Start the server in production mode:
   ```
   cd server
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- React.js and Vite for the frontend framework
- Express.js for the backend API
- MongoDB for the database
- Tailwind CSS for styling
