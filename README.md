<div align="center">
  <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" width="100" alt="Next.js Logo" />
  <h1>Image Enhancer</h1>
  <p>A powerful image enhancement application built with Next.js, TypeScript, and Tailwind CSS. This application provides advanced image processing capabilities, allowing users to enhance, transform, and optimize their images with AI-powered features.</p>
</div>

<div align="center">
  <a href="https://nextjs.org" target="_blank">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  </a>
  <a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://tailwindcss.com" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  </a>
  <a href="https://ui.shadcn.com" target="_blank">
    <img src="https://img.shields.io/badge/ShadcnUI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="ShadcnUI"/>
  </a>
  <a href="https://clerk.com" target="_blank">
    <img src="https://img.shields.io/badge/Clerk-000000?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk"/>
  </a>
  <a href="https://www.docker.com" target="_blank">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  </a>
  <a href="https://aws.amazon.com/ec2" target="_blank">
    <img src="https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS EC2"/>
  </a>
</div>

<br/>

## ✨ Features

- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🔐 Authentication with Clerk
- 📱 Responsive design
- 🛡️ Type-safe development with TypeScript
- 📤 File upload capabilities with React Dropzone
- 🌓 Theme support with next-themes
- 🔔 Toast notifications with Sonner

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- npm
- Docker (optional, for containerized deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/hode2002/image-enhancer-frontend.git
cd client
```

2. Install dependencies:
```bash
npm install --force
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_AI_API_URL=http://localhost:3002

# Clerk Authentication
NEXT_PUBLIC_CLERK_TEMPLATE=custom-template
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
```

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Building for Production

```bash
npm run build
```

## 🐳 Docker Deployment

Build the Docker image:

```bash
docker build -t nest-image-client .
```

Run the container:

```