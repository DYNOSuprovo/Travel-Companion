# 🌍 Travel Companion

A modern web app built with **Next.js (App Router)** and **TypeScript** to help users plan, organize, and enjoy smarter journeys.  
Deployed seamlessly with [Vercel](https://vercel.com), optimized for performance and scalability.

---

## ✨ Features
- ⚡ **Next.js App Router** for server & client rendering
- 📦 **TypeScript** support with strict typing
- 🎨 Modular components in `components/` for reusability
- 🛡️ Middleware (`middleware.ts`) for edge functions (auth/routing)
- 🌐 Optimized for deployment on **Vercel**
- 📁 Clear project structure: `app/`, `lib/`, `public/`, `styles/`
- 🔒 Environment variable support via `.env`

---

## 📂 Project Structure
```
Travel-Companion/
│── app/              # App Router pages & layouts
│── components/       # Reusable UI components
│── lib/              # Utility functions / services
│── public/           # Static assets
│── styles/           # Global styles
│── middleware.ts     # Next.js middleware
│── package.json      # Project metadata & scripts
│── pnpm-lock.yaml    # Dependency lock file
│── tsconfig.json     # TypeScript config
│── next.config.mjs   # Next.js configuration
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) **v18+**
- [pnpm](https://pnpm.io/) (preferred) or npm/yarn

### 2️⃣ Clone the repository
```bash
git clone https://github.com/DYNOSuprovo/Travel-Companion.git
cd Travel-Companion
```

### 3️⃣ Install dependencies
```bash
pnpm install
```

### 4️⃣ Run the development server
```bash
pnpm dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 5️⃣ Build for production
```bash
pnpm build
pnpm start
```

---

## ⚙️ Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
SENTRY_DSN=your_sentry_key_here
NEXT_PUBLIC_ANALYTICS_ID=your_tracking_id
```

> See `.env.example` (to be created) for reference.

---

## 🧪 Scripts
| Command              | Description                         |
|-----------------------|-------------------------------------|
| `pnpm dev`           | Run in development mode             |
| `pnpm build`         | Build for production                |
| `pnpm start`         | Start production server             |
| `pnpm lint`          | Lint codebase                       |
| `pnpm type-check`    | Run TypeScript checks               |
| `pnpm test`          | Run test suite (if configured)      |

---

## 📦 Deployment
This project is optimized for **Vercel**:
1. Push to GitHub  
2. Connect repo to [Vercel](https://vercel.com)  
3. Deploy 🚀  

> Every commit to `main` automatically triggers a new deployment.

---

## 🛡️ Security
- Never commit secrets or API keys.  
- Use `.env.local` for local development.  
- Enable Dependabot & CI checks for security updates.

---

## 🤝 Contributing
Pull requests are welcome! Please open an issue first for major changes.  

### Contribution Guidelines
1. Fork the repo  
2. Create a new branch (`feat/feature-name`)  
3. Commit changes with descriptive messages  
4. Push & open a Pull Request  

---

## 📜 License
This project is licensed under the **MIT License**.  
See [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author
**Suprovo Mallick**  
AI/ML Developer & GenAI Enthusiast ✨  
[GitHub Profile](https://github.com/DYNOSuprovo)

---
