# AWS Certification Simulator 🚀

A professional, high-performance web application designed to help students master AWS Certification exams (Cloud Practitioner, Solutions Architect, etc.) through interactive simulation and data-driven insights.

## ✨ Key Features

* **Dual Learning Modes**:
    * **Study Mode**: Instant feedback with detailed explanations for every question.
    * **Test Mode**: Realistic exam simulation with a countdown timer and final scoring.
* **Dynamic Mock Exams**: Generates a full 65-question simulation by randomly sampling from a massive pool of 23+ exam sets.
* **⚡ Quick Tests**: 10-question rapid-fire sessions designed for efficient "micro-learning" on the go.
* **Performance Analytics**: Interactive trend charts using **Recharts** to visualize your progress and readiness for the official exam.
* **Attempt History & Review**: A "Smart Review" system that saves every attempt, allowing you to revisit past mistakes and study explanations.
* **Dark Mode Support**: Fully integrated dark theme for reduced eye strain during long study sessions.
* **Fully Responsive**: Mobile-first design optimized for study on any device (Desktop, Tablet, or Smartphone).

## 🛠️ Tech Stack

* **Core**: React 18 (TypeScript)
* **Build Tool**: Vite
* **Styling & UI**: Material UI (MUI)
* **State Management**: React Context API
* **Data Visualization**: Recharts
* **Navigation**: React Router Dom
* **Deployment**: AWS Amplify

## 🚀 Installation & Setup

1. **Clone the repository**
  ```bash
  git clone [https://github.com/your-username/aws-quiz-simulator.git](https://github.com/your-username/aws-quiz-simulator.git)
  cd aws-quiz-simulator
   ```

2. **Install dependencies**
  ```bash 
  npm install
  ```

3. **Launch development server**
  ```bash
  npm run dev
  ```

4. **Build for production**
  ```bash
  npm run build
  ```

## 📊 Roadmap
* [ ] Category Analytics: Track performance by AWS domain (Storage, Compute, Security).

* [ ] Study Streak: Gamification system to track consecutive days of practice. 🔥

* [ ] Bookmark System: Save difficult questions to a "Favorites" list for focused review.

* [ ] Global Leaderboard: Compare scores with other students (requires Backend integration).

## 📁 Project Architecture
 * src/context: Global state management for exam logic, timers, and history.
 * src/components: Reusable UI elements (Charts, Question cards, Header).
 * src/views: Main page layouts (Dashboard, Exam Engine, Review View).
 * public/parsed-exams: The question bank stored in optimized JSON structures.

## 📝 License
Distributed under the MIT License. See LICENSE for more information.

*Disclaimer: This tool is a study aid and is not officially affiliated with Amazon Web Services (AWS).*