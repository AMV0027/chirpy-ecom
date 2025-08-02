# CHIRPY Ecommerce Website

A modern React-based ecommerce website with WhatsApp integration for order completion.

## Features

- 🛍️ **Product Showcase**: Display products from Supabase database
- 🛒 **Shopping Cart**: Add/remove products with quantity management
- 👤 **User Authentication**: Sign up, login, and profile management
- 📱 **WhatsApp Integration**: Send orders directly to WhatsApp
- ⭐ **Review System**: Leave reviews after purchasing
- 📦 **Order Tracking**: Track order history and status
- 🎨 **Modern UI**: Clean white theme with Tailwind CSS
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 19.1.0 with Vite
- **Styling**: Tailwind CSS 4.1.11
- **UI Components**: Shadcn/ui + Commerce UI
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecom-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# WhatsApp Configuration
VITE_WHATSAPP_NUMBER=1234567890
VITE_WHATSAPP_MESSAGE_TEMPLATE=your_custom_message_template
```

### 4. Set up Supabase Database

#### Create the following tables in your Supabase project:

**products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images JSONB DEFAULT '[]',
  category TEXT,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**users** (extends Supabase Auth)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  products JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  whatsapp_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**reviews**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**cart_items**
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### 5. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, Footer)
│   ├── ui/             # Shadcn/ui components
│   └── commerce/       # Commerce-specific components
├── pages/
│   ├── Home/           # Home page with featured products
│   ├── Products/       # Product listing and filtering
│   ├── ProductDetail/  # Individual product view
│   ├── Cart/          # Shopping cart management
│   ├── Login/         # User authentication
│   ├── Register/      # User registration
│   ├── Profile/       # User profile management
│   ├── MyOrders/      # Order history and tracking
│   └── Checkout/      # Order completion with WhatsApp
├── stores/
│   ├── useAuthStore.js    # Authentication state
│   ├── useCartStore.js    # Shopping cart state
│   └── useProductStore.js # Product data and filtering
├── lib/
│   ├── utils.js       # Utility functions
│   ├── supabase.js    # Supabase client configuration
│   └── whatsapp.js    # WhatsApp integration utilities
└── styles/
    └── globals.css    # Global styles
```

## Key Features

### 1. Product Management
- Display products from Supabase database
- Product filtering by category, price, and search
- Product detail pages with reviews
- Stock quantity management

### 2. Shopping Cart
- Add/remove products with quantity controls
- Cart persistence across sessions
- Real-time cart updates
- Cart summary with total calculation

### 3. User Authentication
- Sign up and login with Supabase Auth
- User profile management
- Protected routes
- Session persistence

### 4. WhatsApp Integration
- Format cart data for WhatsApp messages
- Direct WhatsApp redirect with order details
- Order tracking via WhatsApp
- Customer communication flow

### 5. Review System
- Post-purchase reviews only
- Star rating system (1-5 stars)
- Review text and image uploads
- Review moderation

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for orders | Yes |
| `VITE_WHATSAPP_MESSAGE_TEMPLATE` | Custom message template | No |

## WhatsApp Message Format

The application automatically formats orders for WhatsApp with the following structure:

```
🛒 *New Order Request*

*Customer:* [Customer Name]
*Phone:* [Customer Phone]
*Email:* [Customer Email]

*Order Items:*
• [Product 1] - Qty: [X] - Price: $[X]
• [Product 2] - Qty: [X] - Price: $[X]
...

*Total Amount:* $[Total]

*Order ID:* [UUID]

Please contact the customer to complete the order.
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Components

1. Install Shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

2. Install Commerce UI components:
```bash
npx shadcn@latest add "https://ui.stackzero.co/r/[component-name].json"
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact: support@chirpy.com
- WhatsApp: +1 (555) 123-4567
