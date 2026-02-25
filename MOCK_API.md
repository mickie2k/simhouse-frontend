# Mock API Documentation

This project includes a complete mock API for development and testing without requiring an external backend server.

## Features

- **Product Management**: Browse products with pagination and filtering
- **Authentication**: Login, register, logout with JWT simulation
- **Booking System**: Create, view, and cancel bookings
- **Schedule Management**: Check availability for simulators
- **Image Handling**: Placeholder images via external service

## Usage

### Enable Mock API

Update your `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/
```

### Disable Mock API (Use External Backend)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/
```

## Available Endpoints

### Products

- `GET /api/product/all?limit=30&page=1` - Get all products with pagination
- `GET /api/product/id/[id]` - Get product by ID
- `GET /api/product/type/[type]?limit=30&page=1` - Get products by type (1=Formula, 2=GT)

### Authentication

- `POST /api/user/login` - Login (accepts any email/password)
- `POST /api/user/register` - Register new user
- `POST /api/user/logout` - Logout
- `POST /api/auth/refresh` - Refresh JWT token

### Bookings

- `GET /api/user/booking` - Get all user bookings (requires auth)
- `GET /api/booking/[id]` - Get booking details (requires auth)
- `POST /api/booking/create` - Create new booking (requires auth)
- `DELETE /api/booking/[id]` - Cancel booking (requires auth)

### Schedule

- `GET /api/schedule/[id]?date=YYYY-MM-DD` - Get availability for simulator

### Images

- `GET /api/image/[filename]` - Get product image (redirects to placeholder)

## Mock Data

### Pre-loaded Products

- 10 base products with detailed information
- Auto-generated products up to 100 total
- Includes Formula (type 1) and GT (type 2) simulators
- Realistic pricing from 800-2000 THB
- Bangkok coordinates for map integration

### Pre-loaded Bookings

- 4 sample bookings in different states:
    - **confirmed**: Upcoming bookings
    - **completed**: Past bookings
    - **pending**: Awaiting confirmation

### Authentication

- Any email/password combination will work for login
- Cookies are set automatically for session management
- `existing@example.com` is reserved to test duplicate registration

## Customizing Mock Data

Edit `src/lib/mockData.ts` to:

- Add more products
- Modify booking data
- Change schedules
- Update availability

## Network Simulation

All endpoints include realistic network delays:

- Product listings: 300ms
- Product details: 200ms
- Authentication: 500ms
- Bookings: 300-500ms

## Switching Between Mock and Real API

The application seamlessly switches between mock and real API based on the `NEXT_PUBLIC_API_URL` environment variable:

1. **Mock API** (`http://localhost:3000/api/`): All requests handled by Next.js API routes
2. **Real API** (`http://localhost:3001/`): Requests forwarded to external backend

No code changes needed - just update the environment variable and restart the dev server.

## Development Tips

- Mock API runs on the same port as Next.js (typically 3000)
- Perfect for frontend development without backend dependencies
- Great for testing authentication flows
- Useful for demos and presentations
- Can be deployed to Vercel/Netlify as a standalone application

## Limitations

- Data is not persisted (resets on server restart)
- Images are placeholder URLs from external service
- Simplified authentication (no real JWT validation)
- No database integration
- Limited error scenarios

## Future Enhancements

Consider adding:

- Local storage persistence
- More complex booking conflicts
- Admin user features
- Payment simulation
- Email notification mocks
