# 📚 PageBack - The Competitive Exam Bookstore

**Live Demo:** [https://page-back.vercel.app/](https://page-back.vercel.app/)

PageBack is a modern, responsive, and highly-targeted e-commerce platform built specifically for students preparing for competitive exams in India. We aim to make expensive preparation materials (JEE, NEET, UPSC, SSC, Banking) accessible by building a robust secondary market where students can buy gently-used materials cheaply and sell them instantly once they clear their exams!

## 🚀 Key Features

### 🛒 Buyer Experience
- **Dedicated Browse & Filter:** Explore textbooks categorized strictly by major competitive exams (SSC & Railway, Banking, JEE, NEET, UPSC, CLAT).
- **Secure Cart & Checkout:** A complete multi-step checkout workflow with Cart management, Promo code discounting, address collection, and payment selection (UPI / COD).
- **Order Tracking Dashboard:** Clients can review the order history alongside detailed receipt information, delivery states, and payment methods.

### 💰 Seller Experience
- **Instant Quotes:** Sellers can input their cleared exam prep materials and get a mock price estimator on the spot.
- **Eco-Friendly Impact Metrics:** We show the seller exactly how many trees they potentially saved and how much carbon footprint was avoided.
- **Smart Pickup Workflow:** Seamless intake form to schedule pickups and arrange NEFT/UPI payouts.

### 🛡️ Admin Portal (Control Center)
The platform includes an encapsulated, fully-mocked dashboard for administrative managers. Access it natively within the application.
- **Order Dispatch:** Track and update the lifecycle of user purchases.
- **Inventory Engine:** Review, edit (price, cover, tags), and delete books from live listings. Includes an automated bulk CSV ingestion system.
- **Sell Requests Intake:** Approve or reject user "Sell" requests. Approvals automatically push the textbook right onto the live platform store!
- **Discounts & Settings:** Modifying active Promo Codes and defining the delivery thresholds on the fly. 
- *Default Admin Credentials: `admin` / `pageback123`*

## 🛠️ Stack & Technologies Used

- **Framework:** React + Vite
- **Styling:** Tailwind CSS (featuring a bespoke non-monochromatic, dynamic "Forest / Cream / Amber" theme color system).
- **Icons:** Lucide-React
- **State Management:** React Context API (CartContext, AdminContext, AuthContext, AppContext).
- **Routing:** React-Router-DOM

## 🔧 Getting Started
To get this project running locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Roodraksh12/PageBack.git
   cd PageBack
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the local development server:**
   ```bash
   npm run dev
   ```
4. **View your application:**
   Open your browser and navigate to `http://localhost:5173/`

## 💡 Origin
Originally conceived as a typical second-hand bookstore ("Second Life Books"), this project was strategically pivoted to target a highly-focused demographic: the massive ecosystem of Indian competitive exam aspirants. With zero fluff and maximum usability, PageBack is built for speed and affordability.
