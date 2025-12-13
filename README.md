# HOUSEMAX 🏡  
### AI-Powered Interior Design & Furniture E-Commerce Platform

HOUSEMAX is an integrated interior design platform that allows users to **design rooms in 2D/3D**, receive **AI-powered design recommendations**, and **purchase furniture** from a built-in e-commerce store — all in one seamless experience.

🚧 **Project Status:** MVP / Demo  
💡 **Focus:** Interior design visualization + shopping experience  
🌍 **Localization:** INR pricing (India-focused)

---

## 📌 Overview

HOUSEMAX bridges the gap between **visual interior planning** and **online furniture shopping**.  
Instead of imagining how furniture might look, users can design their rooms interactively, experiment with layouts, textures, and decor, and directly buy matching products.

The platform is designed as a **frontend-first, serverless web application** with modern tooling and scalable architecture in mind.

---

## ✨ Key Features

- 🧱 Interactive **2D / 3D Room Planner**
- 🛋️ Drag-and-drop furniture, fixtures, and decor
- 🎨 Wall & floor texture customization
- 🤖 **AI Design Assistant** for personalized recommendations
- 🛒 Integrated **e-commerce shop** with cart & checkout flow
- 👤 User authentication & saved designs
- 🇮🇳 **INR pricing localization**
- 🌗 Light / Dark theme support

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** + shadcn-ui
- **Three.js** / `@react-three/fiber` (3D rendering)

### Backend & Services
- **Supabase**
  - Authentication
  - PostgreSQL (planned full migration)
- **LocalStorage** (MVP data persistence)
- **Google Analytics (GA4)**

### Payments (Planned)
- Razorpay / Stripe

### Development Workflow
- **Lovable** – Initial frontend prototyping
- **Cursor** – Backend logic & feature development
- **Antigravity AI** – Final integration, debugging, and iteration

---

## 🧩 Architecture Overview

HOUSEMAX follows a **modern serverless architecture**:

- Frontend-heavy React application
- Supabase for authentication and database services
- Modular entity system for 3D assets
- Context-based state management (Auth, Cart, Theme)
- Clear separation between planning, shopping, and AI features

Detailed architecture, schemas, and user flows are documented in the `/docs` folder.

---

## 📸 Screenshots & Demo

> Screenshots and demo video will be added soon.

Planned visuals:
- Homepage
- 3D Room Planner
- Product Shop
- AI Design Assistant

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- npm
- Git

### Installation

```bash
git clone https://github.com/toufiq13/housemax-design-shop.git
cd housemax-design-shop
npm install
npm run dev
```


Run Locally

The application will be available at:
http://localhost:5173
⚠️ Environment variables are optional for demo usage.
The project includes default configurations for local testing.

📚 Documentation

All major design, planning, and testing documents are included in this repository under the /docs directory:

📄 Product Requirements Specification (PRS)

🧠 System Design Document

📊 Data Collection & Usage Plan

📘 Installation Guide & User Guide

🧪 Test Plan & Test Results

These documents describe the product vision, architecture, data strategy, and validation process in detail.

🔐 Data & Privacy (MVP)

Authentication handled via Supabase Auth

User profiles, cart, and orders stored in localStorage (MVP)

No real payment data is stored

Future production version will:

Migrate all data to Supabase PostgreSQL

Use PCI-compliant payment gateways

Apply stricter access controls

Refer to the Data Collection & Usage Plan in /docs for full details.

🛣️ Roadmap

Planned improvements and features:

 Full migration from localStorage to Supabase DB

 Razorpay / Stripe payment integration

 Admin dashboard for product & order management

 Enhanced AI personalization

 Mobile & tablet optimization

 Performance optimizations for large 3D scenes

🧪 Testing

Functional testing performed for:

3D assets

Pricing localization

Entity cleanup

All major features verified in local environment

Detailed test cases and results are available in the Test Plan & Results document.

👨‍💻 Author

This project was developed as a full-stack product MVP, combining modern frontend technologies, backend services, and AI-assisted development workflows.

📄 License

This project is currently intended for educational and demonstration purposes.
License details can be added if the project is released publicly or commercially.



