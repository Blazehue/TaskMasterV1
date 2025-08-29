# 📝 TaskMaster V1

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)  
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  
[![Drizzle](https://img.shields.io/badge/Drizzle-FFBE2E?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)  
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

A lightweight, fast **task management web app** built with **React + TypeScript** and **Vite**, styled with **Tailwind CSS**.  
Includes **Drizzle ORM** scaffolding for typed, migration-first database workflows and deployable on **Vercel**.

🔗 **Live Demo:** [task-master-v1-seven.vercel.app](https://task-master-v1-seven.vercel.app)

---

## ✨ Features

- ⚡ Lightning-fast dev/build with **Vite**
- 🧩 Strictly typed components with **TypeScript**
- 🎨 Beautiful UI with **Tailwind CSS**
- 🗃️ Optional **Drizzle ORM** setup for database + migrations
- 🚀 Ready-to-deploy on **Vercel**

---

## 🧱 Tech Stack

- **Frontend:** React, TypeScript, Vite  
- **Styling:** Tailwind CSS  
- **ORM (Optional):** Drizzle ORM  
- **Deployment:** Vercel  

## 📁 Project Structure

```bash
TaskMasterV1/
├── dist/                  # Production build output (generated after build)
├── drizzle/               # Drizzle ORM migrations & schema files
├── public/                # Static assets (served as-is)
├── src/                   # Application source code
│   ├── components/        # Reusable React components
│   ├── pages/             # Page-level components
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # Tailwind / global styles
│   ├── utils/             # Helper functions
│   └── main.tsx           # App entry point
│
├── .gitignore             # Git ignored files
├── drizzle.config.ts      # Drizzle ORM configuration
├── env.example            # Example environment variables
├── index.html             # Vite entry HTML
├── package.json           # Project metadata & scripts
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TS config for Node tooling
└── vite.config.ts         # Vite build configuration

```




## ⚙️ Prerequisites

- **Node.js** ≥ 18  
- **Package Manager:** npm / pnpm / yarn / bun  
  _(a `bun.lock` exists → Bun is supported)_  

---

## 🚀 Getting Started

### 1. Clone and Install
```bash
git clone https://github.com/Blazehue/TaskMasterV1.git
cd TaskMasterV1

# choose one
npm install
# pnpm install
# yarn install
# bun install
2. Run Development Server
bash
Copy code
npm run dev
3. Build & Preview
bash
Copy code
npm run build
npm run preview
🔐 Environment Variables
Copy .env.example → .env.local

bash
Copy code
cp env.example .env.local
Fill in values (e.g., DATABASE_URL, etc.).

🗄️ Database (Drizzle ORM)
If using Drizzle:

bash
Copy code
# Generate migrations
npx drizzle-kit generate

# Push migrations
npx drizzle-kit push

# Open studio
npx drizzle-kit studio
🧪 Linting & Formatting
bash
Copy code
npm run lint
npm run format
📦 Deployment (Vercel)
Push to GitHub

Import repo into Vercel

Configure env variables in Vercel

Deploy 🎉

Live link: task-master-v1-seven.vercel.app

🙌 Contributing
Fork this repo

Create a branch → git checkout -b feat/awesome-feature

Commit → git commit -m "feat: add awesome feature"

Push → git push origin feat/awesome-feature

Open a PR 🚀

