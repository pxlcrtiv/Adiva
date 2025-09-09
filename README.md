# Adiva AI - AI-Powered Ad Creation Platform

Adiva AI is a cutting-edge, AI-powered advertising creation platform that leverages Google's Gemini AI to generate compelling ad copy and stunning visuals for multiple social media platforms. Built with React and TypeScript, it provides marketers, entrepreneurs, and content creators with an intuitive interface to create professional-quality advertisements in seconds.

## 🚀 Features

### ✨ AI-Powered Ad Generation
- **Smart Copywriting**: Generate compelling ad headlines, body text, and CTAs tailored to your target audience
- **Visual Creation**: AI-generated high-quality images optimized for social media advertising
- **Platform-Specific Optimization**: Customized content for Instagram, Facebook, TikTok, Google, and LinkedIn

### 🎨 Image Editor & Generator
- **Text-to-Image**: Create stunning visuals from text descriptions
- **Image Editing**: Upload existing images and enhance them with AI-powered modifications
- **Multi-Format Support**: PNG, JPG, and GIF formats supported
- **Real-time Preview**: See changes instantly with interactive previews

### 📊 Smart Organization
- **History Tracking**: Automatically save all generated ads for future reference
- **Favorites System**: Star your best-performing ads for quick access
- **Local Storage**: Persistent storage across browser sessions
- **Search & Filter**: Easy navigation through your ad library

### 🎯 Multi-Platform Support
- **Instagram**: Square format with trending hashtags
- **Facebook**: Optimized for feed and story placements
- **TikTok**: Vertical format with viral content strategies
- **Google**: Search and display ad formats
- **LinkedIn**: Professional tone for B2B marketing

### 🌙 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes based on preference
- **Loading States**: Smooth animations and loading indicators
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### AI & Backend
- **Google Gemini 2.5 Flash** - Advanced language model for text generation
- **Google Imagen 4.0** - State-of-the-art image generation
- **Google GenAI SDK** - Official Google AI integration

### Development
- **ESLint** - Code linting and quality assurance
- **Hot Module Replacement** - Instant development updates
- **Environment Variables** - Secure API key management

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Google AI API Key** - Get yours from [Google AI Studio](https://ai.studio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adiva-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google AI API key:
   ```
   VITE_API_KEY=your_google_ai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start creating amazing ads!

## 📖 Usage Guide

### Creating Your First Ad

1. **Select Your Platform**: Choose from Instagram, Facebook, TikTok, Google, or LinkedIn
2. **Product Details**: Enter your product name, description, and target audience
3. **Generate**: Click "Generate Ad" to create both copy and visuals
4. **Download**: Save your generated images and copy text
5. **Organize**: Star favorites and browse your history

### Using the Image Editor

1. **Upload Images**: Drag and drop or select images for editing
2. **Enter Prompt**: Describe what changes you want to make
3. **Generate**: AI will modify your images based on the prompt
4. **Download Results**: Save your enhanced images

### Managing Your Ads

- **History Tab**: View all previously generated ads
- **Favorites Tab**: Access starred ads quickly
- **Copy Text**: Click any text to copy to clipboard
- **Download Images**: Use the download button on any generated image

## 🎯 Use Cases

### For Marketers
- **Campaign Creation**: Generate multiple ad variations for A/B testing
- **Client Presentations**: Create professional mockups in minutes
- **Social Media Management**: Maintain consistent posting schedules

### For Small Businesses
- **Product Launches**: Create buzz around new products
- **Seasonal Campaigns**: Generate holiday and event-specific ads
- **Brand Awareness**: Build consistent brand messaging

### For Content Creators
- **Sponsored Content**: Create engaging promotional posts
- **Affiliate Marketing**: Generate compelling product promotions
- **Portfolio Building**: Showcase ad creation capabilities

### For Agencies
- **Rapid Prototyping**: Create concepts for client pitches
- **Scale Operations**: Generate hundreds of ad variations
- **Quality Assurance**: Ensure brand consistency across campaigns

## 🔧 API Reference

### Ad Generation
The app uses Google's Gemini AI for both text and image generation:

- **Text Generation**: `generateAdCopy(platform, productName, description, audience)`
- **Image Generation**: `generateAdImage(productName, description, audience)`
- **Image Editing**: `generateOrEditImage(prompt, images)`

### Data Structure
```typescript
interface Ad {
  id: string;
  platform: string;
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  isFavorite: boolean;
  imageUrl?: string;
}
```

## 🎨 Customization

### Adding New Platforms
Edit `constants.ts` to add new advertising platforms:
```typescript
export const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'Google', 'LinkedIn', 'YourPlatform'];
```

### Styling
The app uses Tailwind CSS with custom color schemes. Modify `tailwind.config.js` to customize:
- Brand colors
- Typography
- Spacing scales
- Dark mode variants

### AI Prompts
Customize AI prompts in `services/geminiService.ts` to:
- Adjust tone of voice
- Modify content length
- Add specific requirements
- Change creative direction

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # React components
│   ├── GenerateScreen.tsx    # Main ad generation interface
│   ├── ImageEditorScreen.tsx # Image editing functionality
│   ├── HistoryScreen.tsx     # Ad history management
│   └── FavoritesScreen.tsx   # Favorite ads management
├── services/            # AI service integrations
│   └── geminiService.ts      # Google AI API wrapper
├── contexts/            # React context providers
├── constants.ts         # App constants and configurations
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🔒 Security & Privacy

- **Client-Side Processing**: All AI requests are made client-side
- **API Key Protection**: Uses environment variables for secure API key storage
- **No Data Storage**: No user data is stored on external servers
- **Local Storage**: All data remains in user's browser

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features on GitHub
- **Google AI Support**: Visit [Google AI Studio](https://ai.studio.google.com/) for API-related questions

## 🌟 Acknowledgments

- **Google AI Team** for Gemini and Imagen models
- **React Community** for excellent development tools
- **Tailwind CSS** for the design system
- **Vite Team** for the fast build tool

---

<div align="center">
  <strong>Built with ❤️ using Google AI and React</strong>
  <br />
  <sub>Empowering creators to build amazing advertisements with AI</sub>
</div>
