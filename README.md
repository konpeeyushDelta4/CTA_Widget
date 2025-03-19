# CTA Widget Generator

A versatile widget generator that allows users to create customized chat widgets for Telegram and WhatsApp integration into websites.

## Features

- **Platform Selection**: Choose between Telegram and WhatsApp for your chat widget
- **Customizable Positioning**: Adjust the widget's position on your webpage with visual sliders
- **Contact Information**: Configure your messaging account details 
- **Preview**: Real-time preview of how your widget will appear on your website
- **Copy-to-Clipboard**: One-click copy of the integration script
- **Responsive Design**: Widget works on all device sizes
- **Lightweight**: Minimal impact on page load performance

## How to Use the Widget Generator

1. **Select a Messaging Platform**
   - Choose between Telegram or WhatsApp templates

2. **Configure Widget Position**
   - Use the sliders to adjust the widget's bottom and right position on your website

3. **Enter Contact Information**
   - For Telegram: Enter your Telegram username
   - For WhatsApp: Select your country code and enter your phone number

4. **Preview Your Widget**
   - See a real-time preview of how the widget will look on your website

5. **Copy the Integration Script**
   - Click the "Copy Code" button to copy the integration script
   - Paste the script into your website's HTML, just before the closing `</body>` tag

## Integration Instructions

### Basic Integration

Add the generated script to your website's HTML just before the closing `</body>` tag:

```html
<!-- CTA Widget Integration -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://your-deployment-url.vercel.app/widget.js?platform=telegram&username=yourname&bottom=20&right=20';
    script.async = true;
    script.id = 'cta-chat-widget';
    document.body.appendChild(script);
  })();
</script>
```

### Advanced Configuration

The widget supports the following URL parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `platform` | Chat platform (`telegram` or `whatsapp`) | `telegram` |
| `username` | Your Telegram username (when platform is telegram) | - |
| `phone` | Your WhatsApp number with country code (when platform is whatsapp) | - |
| `bottom` | Position from bottom of screen (px) | `20` |
| `right` | Position from right of screen (px) | `20` |


## Developer Information

### Widget Architecture

- The widget is built as a standalone JavaScript component
- It creates an isolated UI container that doesn't interfere with the host website's styles
- All assets are loaded dynamically
- The widget is fully customizable through URL parameters

### Technical Details

- **Base Script**: `widget.js` - Main entry point
- **Styling**: `widget.css` - Isolated styles for the widget
- **Assets**: SVG icons loaded from `/assets/` directory
- **Deployment**: Automatically deployed on Vercel

### Customization Options for Developers

- **Custom Styling**: Fork the repository and modify the `widget.css` file
- **Additional Platforms**: Extend the platform support in `widget.js`
- **Custom Behaviors**: Modify the widget initialization in `widget.js`

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
