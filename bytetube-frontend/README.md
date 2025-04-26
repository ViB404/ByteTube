# ByteTube Frontend

A modern video streaming platform built with Next.js and TypeScript.

## Environment Variables

This project uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# API configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

In production, you should update these URLs to point to your deployed backend services.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

Then, you can start the production server:

```bash
npm run start
# or
yarn start
```

## Features

- Video streaming with advanced player controls
- Live chat functionality
- Responsive design for all screen sizes
- Interactive UI with smooth animations

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion for animations 