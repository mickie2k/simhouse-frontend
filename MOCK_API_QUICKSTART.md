# Mock API Quick Start Guide

## Setup (2 minutes)

1. **Update your environment file** (`.env.local`):

    ```env
    # Use the mock API
    NEXT_PUBLIC_API_URL=http://localhost:3000/api/
    ```

2. **Restart your dev server**:

    ```bash
    npm run dev
    ```

3. **That's it!** Your app now uses the mock API.

## What You Get

✅ **100 Products** - Auto-generated racing simulators with realistic data  
✅ **4 Sample Bookings** - Different statuses (confirmed, pending, completed)  
✅ **Full Authentication** - Login/register/logout with JWT simulation  
✅ **Booking System** - Create and cancel bookings  
✅ **Image Placeholders** - Automatic placeholder images

## Test It Out

### Login

- Email: **any email works**
- Password: **any password works**
- Try: `test@example.com` / `password123`

### Browse Products

- Navigate to `/page/1` - See products with map
- Click any product to view details
- Map markers show price and location

### Make a Booking

1. Login first
2. View a product detail page
3. Select date and time
4. Create booking
5. View in `/dashboard`

### View Bookings

- Navigate to `/dashboard`
- See all your bookings
- Click to view details
- Cancel bookings from detail page

## API Endpoints

All endpoints available at `http://localhost:3000/api/`:

### Products

- `GET /product/all?limit=30&page=1`
- `GET /product/id/[id]`
- `GET /product/type/[type]`

### Auth

- `POST /user/login` - Body: `{ email, password }`
- `POST /user/register` - Body: `{ email, password, firstName, lastName }`
- `POST /user/logout`
- `POST /auth/refresh`

### Bookings

- `GET /user/booking` (requires auth)
- `GET /booking/[id]` (requires auth)
- `POST /booking/create` (requires auth)
- `DELETE /booking/[id]` (requires auth)

### Other

- `GET /schedule/[id]?date=YYYY-MM-DD`
- `GET /image/[filename]`

## Switch Back to Real API

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/
```

Then restart the dev server.

## Customization

Edit `src/lib/mockData.ts` to:

- Change product details
- Add more bookings
- Modify schedules
- Update host information

## Limitations

⚠️ Data resets on server restart  
⚠️ Images are placeholders  
⚠️ Simplified authentication  
⚠️ No real database

Perfect for:
✓ Frontend development  
✓ UI/UX testing  
✓ Demos & presentations  
✓ Working offline

---

For full documentation, see [MOCK_API.md](./MOCK_API.md)
