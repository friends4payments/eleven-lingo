# Frontend - Eleven Lingo

Modern frontend project built with Next.js 15, React 19, TypeScript 5, and Tailwind CSS v3.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **React**: 19.x
- **TypeScript**: 5.x with strict configuration
- **Styling**: Tailwind CSS v3 with PostCSS
- **UI Library**: shadcn/ui ("new-york" style)
- **Base Components**: Radix UI
- **Icons**: lucide-react
- **Theme**: Native dark mode with next-themes

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev:frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles and theme variables
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   └── utils.ts           # Utilities (cn function, etc.)
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Features

- ✅ Strict typing with TypeScript
- ✅ Modern and accessible UI
- ✅ Native dark mode
- ✅ Scalable design system
- ✅ Optimized Server Components
- ✅ Mobile-first responsive design
- ✅ Modular and reusable components

