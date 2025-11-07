# Hits Tempo App

A client-only tempo analyzer application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Analyze hitting tempo using three timestamps (Load, Fire, Contact)
- Calculate Load Phase, Fire Phase, and Tempo Ratio
- Get instant coaching cues based on tempo analysis

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main tempo analyzer page
│   └── globals.css     # Global styles
├── src/
│   └── lib/
│       └── tempo.ts    # Tempo calculation logic
└── public/             # Static assets
```
