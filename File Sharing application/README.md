# File Sharing Application Backend

A secure and scalable file sharing application backend built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- File upload with size limits
- File sharing with specific users
- Shareable links with expiration
- Storage quota management
- Download tracking
- Secure file storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd file-sharing-application
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
PORT=3000
MONGODB_URI=
JWT_SECRET=
BASE_URL=http://localhost:3000
```

4. Create an uploads directory:
```bash
mkdir uploads
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### File Operations
- POST `/api/files/upload` - Upload a file
- GET `/api/files/my-files` - Get all files for authenticated user
- GET `/api/files/download/:fileId` - Download a file
- POST `/api/files/share/:fileId` - Share a file with another user
- POST `/api/files/share-link/:fileId` - Generate a shareable link
- DELETE `/api/files/:fileId` - Delete a file

## Security Features

- JWT-based authentication
- File access control
- Storage quota management
- Secure file storage
- Password hashing
- Request validation

## Error Handling

The application includes comprehensive error handling for:
- File upload errors
- Authentication errors
- Storage quota exceeded
- Invalid file access
- Server errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request