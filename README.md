# Hits Tempo App

Hits Tempo App is a lightweight, client-only Next.js 15 experience for analyzing swing tempo. Enter three timestamps—Load, Fire, and Contact—to instantly calculate phase durations, tempo ratio, and receive a quick coaching cue. The interface is dark, athletic, and built entirely with Tailwind CSS.

## Getting Started

- `npm install` – install dependencies  
- `npm run dev` – start the development server  
- `npm run build` – build for production  
- `npm run start` – run the production build  
- `npm run lint` – run lint checks

## Project Structure

- `app/` – App Router entry points and global styles  
- `src/lib/tempo.ts` – core tempo calculation utilities  
- `public/` – static assets

## Tempo Math

- **Load Phase** = Fire − Load  
- **Fire Phase** = Contact − Fire  
- **Tempo Ratio** = Load Phase ÷ Fire Phase  

Each analysis highlights the ratio and offers a simple coaching cue to help athletes fine-tune their rhythm.
