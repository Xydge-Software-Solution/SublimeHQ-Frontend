# Sublime

Welcome to **Sublime**, a modern and responsive web application built with [Next.js](https://nextjs.org/), React, TypeScript, and Tailwind CSS.

## 🚀 Project Overview

This project serves as a comprehensive landing page or web platform featuring a variety of high-quality UI sections tailored for modern web experiences.

### Key Features & Components
- **Hero Section**: Engaging first impression with the `Hero.tsx` component.
- **Bento Grid**: A stunning layout for showcasing features using `BentoGridSection.tsx`.
- **AI Integration**: Dedicated `AiSection.tsx` for highlighting AI-powered capabilities.
- **Social Proof**: Trust indicators via `TestimonialSection.tsx` and `StatsSection.tsx`.
- **User Flow**: Clear user journey demonstrated by `StepsSection.tsx` and `StackedCardsSection.tsx`.
- **Call To Action**: High-conversion `CtaSection.tsx`.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Utilities**: Custom hooks (e.g., `use-mobile.ts`) and helpers (`lib/utils.ts` for clean class merging).

## 💻 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
- Node.js 18.x or later installed on your machine.
- Your preferred Node package manager (npm, yarn, pnpm, bun).

### Installation
1. Navigate to the project directory:
   ```bash
   cd sublime
   ```
2. Install the dependencies:
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

### Running the Development Server
Start the development server:
```bash
npm run dev
# or yarn dev / pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/`: Next.js App Router core (`layout.tsx`, `page.tsx`, `globals.css`).
- `components/`: Reusable React UI sections (Hero, Navbar, Footer, etc.).
- `hooks/`: Custom React hooks specific to UI or domain logic.
- `lib/`: Utility functions and configuration helpers.
- `public/`: Static assets and media.

## 📄 License
Copyright (c) 2026 XYGDE LLC. All Rights Reserved.