# 🧠 AI-Powered MERN Stack Project Generator 🌐

An AI-based full-stack development playground that lets you generate, run, and debug **MERN stack applications in real-time** — just by entering a prompt.

🚀 Built using **React**, **Node.js**, **Express**, **Socket.IO**, and **OpenAI** (or Gemini) — with custom logic for error detection, local save, and live code correction.

---

## ⚙️ Features

- ✨ **Prompt-to-Code Generation**  
  Generate full MERN stack apps from natural language prompts.

- 🔄 **Real-time Debugging**  
  Live error detection + AI-based suggestions via WebSockets.

- 💬 **Prompt Enhancer**  
  Transforms short inputs into detailed prompts for better results.

- 💾 **Save to Local**  
  Export generated project files directly to your machine.

- 🔐 **JWT-secured WebSockets**  
  Ensures secure connections during generation and debugging.

- 🌐 **Hosted Frontend + Backend**  
  Frontend on Vercel, backend on Render.

---

## 🛠️ Tech Stack

| Tech       | Description                           |
|------------|---------------------------------------|
| React.js   | Frontend framework (Vite + Tailwind)  |
| Node.js    | Backend runtime environment           |
| Express.js | API server for project interactions   |
| Socket.IO  | Real-time client-server communication |
| OpenAI/Gemini | LLM for project generation         |
| JWT Auth   | Auth for secure WebSocket connections |

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/ai-mern-generator.git

# Install dependencies
cd ai-mern-generator/client
npm install

cd ../server
npm install
