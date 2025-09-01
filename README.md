# 🏫 Campus Online - Abraham Adesanya Polytechnic

A comprehensive web-based marketplace platform that brings campus transactions online — allowing students and staff of Abraham Adesanya Polytechnic to buy, sell, and discover services and products in one centralized place.

## 🚀 **Core Features**

### **👤 User Management & Authentication**

- **Supabase Auth Integration**: Secure user registration and login
- **Profile Management**: Complete user profiles with department, skills, bio, and avatar
- **Role-based Access**: Support for both students and staff members
- **Profile Setup Modal**: Guided profile creation for new users

### **🛒 Marketplace & Listings**

- **Create Listings**: Multi-image upload with drag & drop support
- **Edit & Delete**: Full CRUD operations for user listings
- **Image Management**: Support for multiple images per listing with preview
- **Category System**: Organized listings across 14+ categories
- **Currency**: Nigerian Naira (₦) pricing support

### **🔍 Discovery & Search**

- **Advanced Search**: Keyword-based search across titles and descriptions
- **Category Filters**: Filter by product/service categories
- **Price Range Filtering**: Set minimum and maximum price limits
- **Pagination**: Server-side pagination for optimal performance
- **Exclusion Logic**: Current user's listings hidden from marketplace

### **💬 Communication & Contact**

- **WhatsApp Integration**: Direct contact with sellers via WhatsApp
- **Seller Information**: Complete seller profiles with contact details
- **Safe Trading**: Safety notices and guidelines for campus meetups

### **❤️ Favorites System**

- **Add/Remove Favorites**: Save interesting listings for later
- **Favorites Dashboard**: Quick access to saved items
- **Cross-platform Sync**: Favorites available across all pages

### **📱 User Experience**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error logging and user feedback

## 🛠️ **Tech Stack**

### **Frontend**

- **React 19**: Latest React with modern hooks and features
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Router 7**: Client-side routing
- **TanStack Query**: Server state management and caching
- **React Hot Toast**: Toast notifications
- **Lucide React**: Beautiful, customizable icons
- **Framer Motion**: Smooth animations and transitions

### **Backend & Database**

- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Real-time Database**: Live updates and subscriptions
- **Row Level Security**: Secure data access
- **Storage**: Image upload and management
- **Authentication**: Built-in user management

### **Development Tools**

- **ESLint**: Code quality and consistency
- **React DevTools**: Development debugging
- **TanStack Query DevTools**: Query debugging and monitoring

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── CreateListingModal.jsx    # Listing creation form
│   ├── DashboardLayout.jsx       # Main dashboard wrapper
│   ├── Navigation.jsx            # Top navigation bar
│   └── ProfileSetupModal.jsx     # Profile configuration
├── hooks/              # Custom React hooks
│   ├── useAllListings.js         # Marketplace data fetching
│   ├── useFavorites.js           # Favorites management
│   ├── useListings.js            # User listings
│   └── useProfile.js             # User profile data
├── pages/              # Application pages
│   ├── Dashboard.jsx             # Main dashboard
│   ├── LandingPage.jsx           # Public landing page
│   ├── LoginPage.jsx             # Authentication
│   ├── Marketplace.jsx           # Browse all listings
│   ├── Profile.jsx               # User profile management
│   └── YourListing.jsx           # User's listings
└── lib/                # External integrations
    └── supabase.js               # Supabase client configuration
```

## ⚙️ **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/campus-online.git
cd campus-online
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Environment Configuration**

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

### **4. Database Setup**

- Create a new Supabase project
- Set up the required tables (listings, profiles, favorites)
- Configure Row Level Security policies
- Set up storage buckets for images

### **5. Run Development Server**

```bash
npm run dev
```

### **6. Build for Production**

```bash
npm run build
npm run preview
```

## 🔐 **Database Schema**

### **Profiles Table**

- User authentication and profile information
- Department, role, skills, and contact details
- Avatar image support

### **Listings Table**

- Product/service information with images
- Category classification and pricing
- Creation and update timestamps

### **Favorites Table**

- User-listing relationships
- Prevents duplicate favorites

## 🎨 **UI/UX Features**

- **Responsive Grid Layouts**: Adapts to all screen sizes
- **Modern Card Design**: Clean, organized information display
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Loading States**: Skeleton screens and progress indicators

## 🚀 **Deployment**

The application is optimized for deployment on:

- **Vercel**: Recommended for React applications
- **Netlify**: Easy deployment with Git integration
- **Supabase**: Hosted backend and database
- **Any Static Host**: Build output can be deployed anywhere

## 📱 **Mobile Experience**

- **Touch-friendly Interface**: Optimized for mobile devices
- **Responsive Navigation**: Collapsible mobile menu
- **Image Optimization**: Fast loading on mobile networks
- **Gesture Support**: Swipe and touch interactions

## 🔒 **Security Features**

- **Row Level Security**: Database-level access control
- **Authentication**: Secure user login and session management
- **Input Validation**: Client and server-side validation
- **Image Upload Security**: File type and size restrictions

## 📄 **License**

This project is developed for educational purposes at Abraham Adesanya Polytechnic. All rights reserved.

## 🤝 **Contributing**

This is a private educational project. For questions or support, please contact the development team.

---

**Built with ❤️ for Abraham Adesanya Polytechnic**
