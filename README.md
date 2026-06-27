# 🛒 eCart - Premium MEAN Stack E-Commerce Platform

Welcome to **eCart**, a modern, feature-rich, and visually stunning e-commerce web application. Built using the **MEAN Stack** (MongoDB, Express.js, Angular 21, and Node.js), this project serves as a premium showcase of modern web engineering, containerized orchestration, and responsive design patterns.

---

## 🔗 Live Application Links

- 🌐 **Frontend Application (UI):** [https://ecart-mean-stack-1.onrender.com](https://ecart-mean-stack-1.onrender.com)
- ⚙️ **Backend REST API:** [https://ecart-mean-stack.onrender.com](https://ecart-mean-stack.onrender.com)

---

## ✨ Features at a Glance

### 🎨 Visual & UI Excellence
- **Sleek Light/Dark Mode:** A global, smooth theme switcher driven by custom CSS variables that instantly shifts the theme across all sections (Home, About Us, Contact Us, Login, Signup, and Admin Dashboards).
- **Responsive Card Layouts:** Meticulously styled product, contact, and signup cards designed with rich aesthetics, glassmorphism hints, and hover animations.
- **Premium Typography & Transitions:** Uses curated fonts (Outfit/Inter) with transition timings that feel premium and responsive.

### 🛡️ Core E-Commerce Logic
- **Advanced Cart & Saved Items:** Fully functional cart system with state management allowing users to add, remove, adjust quantities, and instantly transfer items to a **"Save for Later"** wishlist.
- **Zoneless Angular Architecture:** Uses Angular 21 signals and manual change propagation (`ChangeDetectorRef.markForCheck()`) to ensure blistering-fast, efficient rendering without overhead.
- **Dynamic Product Operations:** Administrators can add, view, update (with pre-filled forms), and delete products dynamically.
- **JWT-Based Authentication:** Secure user authentication with client-side token persistence and role-based route guards (User / Admin).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Details & Purpose |
| :--- | :--- | :--- |
| **Frontend** | Angular 21, RxJS | Signals-based state management, modular routing, reactive HTTP clients, and custom stylesheets. |
| **Backend** | Node.js, Express.js | Modular router, JWT authentication middlewares, and strict error handlers. |
| **Database** | MongoDB, Mongoose | Document database with schema models for Users, Products, Carts, and Orders. |
| **Reverse Proxy** | Nginx | Serves static frontend client, resolves production CORS issues, and proxies `/api/` traffic directly to Node container. |
| **DevOps** | Docker, Docker Compose | Complete containerization of frontend, backend, and MongoDB services. |

---

## 📂 Project Structure

```text
eCart_MEAN_Stack/
├── backend/                  # Express REST API Backend
│   ├── config/               # Database connection configurations
│   ├── controllers/          # API route request handlers
│   ├── middlewares/          # JWT and error-handling middlewares
│   ├── models/               # Mongoose DB schema definitions
│   ├── routes/               # Modular Express router files
│   ├── Dockerfile            # Production Node build config
│   ├── .env.example          # Environment variable template
│   └── server.js             # API server entry point
├── frontend/                 # Angular Client Frontend
│   ├── src/
│   │   ├── app/              # Router, core components & services
│   │   ├── environments/     # Environment-based API endpoint configurations
│   │   └── styles.css        # Global CSS variables & layout definitions
│   ├── Dockerfile            # Multi-stage Angular & Nginx production build
│   ├── nginx.conf            # Nginx reverse proxy configuration
│   └── angular.json          # Angular compilation & builder instructions
└── docker-compose.yml        # Multi-container service orchestration configuration
```

---

## 🚀 Getting Started

You can run this project locally in two ways: **Directly using Node/Angular CLIs** (for development) or **Using Docker Compose** (for automated orchestration).

### Method 1: Using Docker Compose (Recommended & Easiest)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eCart_MEAN_Stack.git
   cd eCart_MEAN_Stack
   ```

2. **Boot the entire stack:**
   ```bash
   docker-compose up --build
   ```
   *This single command builds frontend assets, fires up a local MongoDB instance, starts the Express REST API backend, configures Nginx, and bridges them together.*

3. **Access the application:**
   - **Frontend UI:** Visit [http://localhost](http://localhost) (Port 80)
   - **Backend API:** Visit [http://localhost:3000](http://localhost:3000)

---

### Method 2: Manual Local Setup

#### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your local MongoDB connection string and JWT Secret:
     ```env
     MONGO_URI=mongodb://127.0.0.1:27017/eCart
     JWT_SECRET=SecureJWTSecretKey
     PORT=3000
     ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will boot up at `http://localhost:3000`.*

#### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
   *The frontend client will run at `http://localhost:4200`.*

---

## 🌐 Production Deployment Architecture

This project is built from the ground up to be **ready for production deployment**. Here's how it works:

1. **Angular Build Configuration:**
   - During local development, the frontend services communicate with `http://localhost:3000` using configurations from `environment.ts`.
   - When building for production (`npm run build`), Angular automatically swaps this file with `environment.prod.ts` which redirects the API calls relatively to `/api`.

2. **Nginx Reverse Proxy:**
   - The frontend's production Nginx container intercepts all traffic.
   - Any requests sent to `/api/*` are dynamically forwarded to the backend service container at `http://backend:3000/`.
   - This resolves **CORS (Cross-Origin Resource Sharing)** issues without needing hardcoded domain names, making cloud deployments seamless.
