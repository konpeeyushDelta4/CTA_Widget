# CTA Widget Generator

A versatile widget generator that allows users to create customized chat widgets for Telegram and WhatsApp integration into websites.

## Features

- Template selection for different messaging platforms
- Customizable widget position
- Contact information configuration
- Integration script generation

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Building for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Deploying to Vercel

1. Create a Vercel account if you don't have one
2. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
3. Configure the `.env` file with your Vercel deployment URL:
   ```
   VITE_PROD_URL=https://your-app-name.vercel.app
   ```
4. Deploy the project:
   ```bash
   vercel
   ```
5. For production deployment:
   ```bash
   vercel --prod
   ```

## Environment Variables

The application uses the following environment variables:

- `VITE_HOST`: Host for local development (default: localhost)
- `VITE_PORT`: Port for local development (default: 4173)
- `VITE_PROD_URL`: Production URL for Vercel deployment

The application automatically detects whether it's running in development or production mode and generates widget integration scripts with the appropriate URLs.