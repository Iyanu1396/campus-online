🏫 Campus Online Marketplace

A web-based platform that brings campus transactions online — allowing students and staff of Abraham Adesanya Polytechnic to buy, sell, and discover services and products in one centralized place.

🚀 Features

👤 User Profiles → Register/login with personal info, department, skills, and bio

🛒 Listings → Create, view, edit, and delete product/service listings with images

🔍 Search & Filters → Easily discover listings by keyword or category

💬 Communication → Direct WhatsApp redirection to contact sellers

🛠️ Admin Panel → Manage users and listings

📱 Responsive UI → Works on mobile and desktop

🛠️ Tech Stack

Frontend: React (Vite), Tailwind CSS, React Router, TanStack Query

Backend: Node.js, Express.js, Prisma ORM

Database: PostgreSQL (Supabase)

Icons: Lucide React

⚙️ Setup Instructions

1. Clone the repo
   git clone https://github.com/your-username/campus-online.git
   cd campus-online

2. Install dependencies
   npm install

3. Configure Environment Variables

Create a .env file in the root and add:

# Database (Prisma + Supabase)

DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase Client (Frontend)

VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

4. Run development server
   npm run dev

📄 License

This project is for educational purposes at Abraham Adesanya Polytechnic.
