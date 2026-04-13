<div align="center">
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini"/>
</div>

<h1 align="center">VTRIPS - AI-Powered Travel Planner 🌍✈️</h1>

<p align="center">
  <strong>The Future of Travel Planning • Focused on Human-Computer Interaction (HCI)</strong>
</p>

<p align="center">
  <a href="#about-the-project">About</a> •
  <a href="#hci-focus--design-thinking">HCI Focus</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a>
</p>

---

## 📖 About the Project

**VTRIPS** is a modern, AI-powered travel planning companion that completely reimagines how users organize their journeys. Developed with a strong emphasis on **Human-Computer Interaction (HCI)** best practices, VTRIPS generates personalized itineraries, budget evaluations, and travel logistics through a sleek, highly responsive interface powered by Google's Gemini AI.

This application minimizes the cognitive load of travel planning by consolidating mapping, scheduling, and budgeting into an accessible and aesthetically pleasing single-page application.

---

## 🎨 HCI Focus & Design Thinking

This project heavily incorporates HCI principles to ensure that software isn't just functional, but *delightful* to use:

- **Reduce Cognitive Overload**: Complex API data is transformed into bite-sized, interactive UI components using **Zustand** for state management to avoid jarring page reloads.
- **Micro-Animations & Feedback**: Leveraging **Framer Motion**, the interface provides immediate visual feedback for every interaction (hover states, loaders, transitions), keeping users oriented and confident in their actions.
- **Clarity & Affordance**: Utilizing **Lucide-React** icons and **Tailwind CSS** aesthetics, elements clearly communicate their purpose (e.g., clickable buttons, scrollable maps).
- **Graceful Error Handling**: Fallbacks and user-friendly error messages (e.g., when API quotas are exceeded or data is missing) prevent frustration and help users recover quickly.
- **Accessibility & Responsiveness**: Fluid grids and touch-friendly targets ensure the app looks and feels perfect on any device, from desktop to mobile.

---

## ✨ Features

- **🤖 AI Trip Generation**: Intelligent, dynamic itinerary creation utilizing the Google Gemini AI.
- **🗺️ Interactive Maps**: Visual geographic routing and plotting using **Leaflet** and `react-leaflet`.
- **📊 Real-time State & Feedback**: Lightning-fast UI interactions providing real-time feedback using Zustand.
- **📄 Export to PDF**: One-click download of your complete itinerary utilizing `html2pdf.js`.
- **🔒 Secure Data Handling**: Integrated with **Supabase** to manage secure and scalable backend logic.
- **🚆 Transit Integration**: Includes dedicated services for tracking and managing train services effectively.

---

## 🛠 Tech Stack

### Frontend UI/UX
* **React 19** & **Vite**: Ultra-fast core framework.
* **Tailwind CSS 4**: Utility-first, highly customizable styling.
* **Framer Motion**: Fluid, physics-based animations.
* **React Router v7**: Seamless single-page routing without page refreshes.
* **Zustand**: Lightweight and unopinionated state management.

### Backend & Infrastructure
* **Node.js** & **Express**: Robust, asynchronous backend architecture.
* **Google Generative AI (Gemini)**: Complex algorithmic trip generation.
* **Supabase**: Open-source Firebase alternative for backend services.
* **Axios**: Promised-based HTTP client for the browser and node.js.

---

## 🚀 Installation & Setup

Want to run VTRIPS locally? Follow these simple steps.

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Gemini API Key
- Supabase Account (optional depending on config)

### 1. Clone the Repository
```bash
git clone https://github.com/Gnxshxvr/Vtrips_.git
cd Vtrips_
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add your keys:
```env
PORT=5000
GEMINI_API_KEY=your_api_key_here
```
Run the server:
```bash
npm run dev
```

### 3. Setup the Frontend (Client)
Open a new terminal window:
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```
Run the interactive frontend:
```bash
npm run dev
```

The app will become available at `http://localhost:5173`.

---

## 💡 Usage

1. **Input Parameters**: Enter your destination, travel dates, and available budget.
2. **AI Processing**: Enjoy the seamless loading micro-interactions while Gemini curates your trip.
3. **Explore**: Interact with your personalized itinerary, map markers, and day-by-day breakdowns.
4. **Save/Export**: Export your fully customized plan as a PDF for offline use.

---

<div align="center">
  <i>If you found this project helpful or inspiring, please consider leaving a ⭐ on the repository!</i>
</div>
