# AI Learning Companion - Frontend

Modern React application featuring specialized user interfaces for Teachers and Parents.

## 🎨 Design Systems

### Teacher Interface (Vedantu-Inspired)
- **Concept**: Sidebar-driven management dashboard.
- **Key Elements**: Left sidebar with orange accents, card-based metrics, and milestone progress tracks.
- **Target**: Productivity and classroom engagement.

### Parent Interface (Professional & Warm)
- **Concept**: Navbar-driven informational portal.
- **Key Elements**: Top navigation, white/soft-gray backgrounds, and large interactive tiles.
- **Target**: Accessible home learning support.

## 💻 Technical Architecture

### Component Structure
- **Pages**: Role-specific layouts (`teacher/` and `parent/` directories).
- **Shared Components**: Reusable UI like `FlashcardGrid` and `ResponseCard`.
- **API Service**: Centralized `api.js` using Axios interceptors for backend communication.

### State Management
Utilizes React `useState` and `useEffect` hooks for component-level state. Routing is handled by `react-router-dom` with a clean separation of Teacher and Parent entry points.

## ⚡ Performance
Built with **Vite 8**, providing sub-second Hot Module Replacement (HMR) and optimized production builds. Icons are pulled from **Lucide-React** for a clean, professional aesthetic.

## 🌍 Multilingual Support
The frontend includes integrated support for 9 regional languages, making it accessible to a diverse set of users across India.
