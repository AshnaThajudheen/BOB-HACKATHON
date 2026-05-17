# BobCat - Pitch & Presentation Guide

This document contains everything you need to build your hackathon presentation or pitch deck for **BobCat**.

---

## 🚀 1. The Problem
Developers spend up to **30-40% of their time** writing boilerplate tests, documenting APIs, and trying to understand undocumented legacy code. This slows down feature delivery, leads to technical debt, and makes onboarding new engineers incredibly painful.

## 💡 2. The Solution: BobCat
**BobCat** is an intelligent developer tool that instantly analyzes any GitHub repository and automatically generates:
1. **Comprehensive Unit & Integration Tests**
2. **Standardized API Documentation (OpenAPI/Swagger)**
3. **Deep Code Explanations & Architectural Summaries**

Simply paste a GitHub link, and let IBM Watsonx do the heavy lifting.

---

## 🛠️ 3. Technology Stack

### Frontend (User Experience)
- **Framework**: React.js with Vite for lightning-fast builds.
- **Styling**: Tailwind CSS & Framer Motion (for premium, dynamic animations).
- **Rendering**: `react-markdown` and `@tailwindcss/typography` to beautifully render complex AI code outputs.

### Backend (The Engine)
- **Framework**: FastAPI (Python) for high-performance, asynchronous API routing.
- **State Management**: SQLite database for persisting historical repository analyses.
- **Integrations**: GitHub REST API (fetching raw file trees and contents).

### Artificial Intelligence (The Brain)
- **Provider**: IBM Watsonx AI
- **Model**: `ibm/granite-34b-code-instruct`
- **Processing**: We use `tiktoken` to intelligently chunk large codebases, ensuring we respect the model's context limits (3000 tokens per file) while extracting the most critical logic.

---

## ⚙️ 4. Key Technical Achievements (The "Wow" Factor)
Make sure to highlight these technical hurdles you overcame during the hackathon:

1. **Asynchronous Architecture**: AI generation takes time. Instead of letting the browser time out, we built a non-blocking backend using FastAPI `BackgroundTasks`. The React frontend continuously polls the server every 3 seconds to provide a seamless "Processing..." experience.
2. **Smart File Parsing**: The backend doesn't just blindly send code to the AI. It traverses the GitHub tree, ignores binary/image files, and chunks the code securely.
3. **Dynamic URL Handling**: The system auto-corrects user inputs (like stripping `.git` from URLs) to ensure flawless GitHub API integration.

---

## 🔮 5. Future Goals (The Roadmap)
Judges love to see where the project is heading next. Mention these as your future milestones:

1. **Direct GitHub PR Integration**: Instead of just displaying the code, BobCat will automatically open a Pull Request (PR) on the user's repository injecting the new tests and `README.md` updates directly into their codebase.
2. **Private Repository Support**: Implement GitHub OAuth so companies can securely analyze their proprietary, private codebases.
3. **CI/CD Pipeline Plugin**: Build a GitHub Action so BobCat runs automatically on every single commit, ensuring documentation and tests never fall out of date.
4. **Interactive "Chat with your Repo"**: Add a conversational UI where developers can chat with IBM Watsonx to ask specific questions like, *"Where is the authentication logic handled in this repo?"*
5. **Multi-Language Fine-Tuning**: Expand support to perfectly handle niche frameworks and legacy languages by leveraging custom-tuned IBM Watsonx models.
