TaskMaster V1

A lightweight, fast task management web app built with React + TypeScript and Vite, styled with Tailwind CSS. The project includes Drizzle ORM scaffolding for a typed, migration-first database workflow and is deployable to Vercel.

Live demo: task-master-v1-seven.vercel.app 
GitHub

✨ Features

⚡ Fast dev/build powered by Vite.

🧩 Typed components with TypeScript.

🎨 Tailwind CSS utility-first styling.

🗃️ (Optional) Drizzle ORM migrations & schema (see drizzle/).

🚀 One-click deploy to Vercel (link present in repo). 
GitHub

Note: The repo contains dist/, public/, src/, drizzle/, and config files including vite.config.ts, tailwind.config.js, and drizzle.config.ts. Languages reported by GitHub: TypeScript (≈92%), JavaScript, CSS, and HTML. 
GitHub

🧱 Tech Stack

Frontend: React, TypeScript, Vite

Styling: Tailwind CSS

ORM (optional): Drizzle ORM (with drizzle/ directory and drizzle.config.ts)

Deployment: Vercel

If you’re also using shadcn/ui or lucide-react, add them here.

📁 Project Structure
TaskMasterV1/
├─ dist/                 # Production build output
├─ drizzle/              # Drizzle migrations & schema (if used)
├─ public/               # Static assets
├─ src/                  # App source (components, hooks, pages, etc.)
├─ index.html            # Vite entry HTML
├─ vite.config.ts        # Vite config
├─ tailwind.config.js    # Tailwind config
├─ postcss.config.mjs    # PostCSS config
├─ drizzle.config.ts     # Drizzle config
├─ tsconfig*.json        # TypeScript configs
└─ package.json          # Scripts & dependencies


The repository listing verifies these files/folders are present. 
GitHub

⚙️ Prerequisites

Node.js ≥ 18 (recommended)

Package manager: npm, pnpm, yarn, or bun (a bun.lock exists—use Bun if you prefer). 
GitHub

🚀 Getting Started

Clone and install:

git clone https://github.com/Blazehue/TaskMasterV1.git
cd TaskMasterV1

# choose one
npm install
# pnpm install
# yarn
# bun install


Start the dev server:

# choose one
npm run dev
# pnpm dev
# yarn dev
# bun dev


Build & preview:

npm run build
npm run preview


If your scripts differ, update this section after checking package.json.

🔐 Environment Variables

There’s an env.example in the repo. Copy it to create your local env file:

cp env.example .env.local


Fill in the variables as needed (e.g., DATABASE_URL, etc.).

I couldn’t open the exact contents of env.example via the viewer; add precise keys here if needed. 
GitHub

🗄️ Database & Migrations (Drizzle)

If you’re using Drizzle:

Configure your DB connection in .env.local per drizzle.config.ts.

Generate migrations from schema:

npx drizzle-kit generate


Push/apply migrations:

npx drizzle-kit push


(Optional) Studio:

npx drizzle-kit studio


Adjust commands if you’re using project-local scripts.

🧪 Linting & Formatting

Typical scripts (verify in package.json):

npm run lint
npm run format

📦 Deployment

The repository links to a Vercel deployment. For a fresh deployment:

Push the repo to GitHub.

Import the project in Vercel.

Set environment variables in Vercel Project Settings.

Trigger a production build.

Live link shown on the repo: task-master-v1-seven.vercel.app. 
GitHub

🙌 Contributing

Fork the repo

Create a feature branch: git checkout -b feat/awesome-thing

Commit: git commit -m "feat: add awesome thing"

Push: git push origin feat/awesome-thing

Open a Pull Request
