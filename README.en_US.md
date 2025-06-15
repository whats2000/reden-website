# Reden Website

🌍 **Language**: [English](README.en_US.md) | [中文](README.md)

### 🎯 About Reden

Reden is a comprehensive platform for Minecraft redstone enthusiasts, providing tools, resources, and community features for sharing and creating redstone contraptions. The name "Reden" comes from "Redstone Eden" - a paradise for redstone lovers.

### ✨ Features

- **🔧 Litematica Generator**: Online generator for redstone machines like world eaters and tunnel bores
- **📋 Schematic Sharing**: Upload, share, and download litematica files
- **🎮 Minecraft Integration**: Verified Minecraft account linking with Microsoft authentication
- **🌐 Multi-language Support**: Available in English, Chinese (Simplified/Traditional), and Russian
- **👥 Community Features**: User profiles, following system, and social interactions
- **🛠️ Studio Tools**: Online litematica editor with block replacement and version conversion
- **📊 Analytics**: Download tracking and popularity metrics
- **🎨 Modern UI**: Built with Vuetify and modern web technologies

### 🛠️ Technology Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/) (Vue.js)
- **UI Library**: [Vuetify 3](https://vuetifyjs.com/)
- **Styling**: CSS3 with modern design patterns
- **Internationalization**: @nuxtjs/i18n for multi-language support
- **Content Management**: @nuxt/content for documentation
- **State Management**: Pinia
- **Authentication**: Microsoft OAuth integration
- **PWA**: Progressive Web App capabilities

### 🚀 Getting Started

#### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

#### Installation

1. Clone the repository:
```bash
git clone https://github.com/RedenMC/reden-website.git
cd reden-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

#### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build
- `npm run dev-prod-backend` - Development with production backend

### 📁 Project Structure

```
├── components/          # Vue components
│   ├── layout/         # Layout components (header, footer)
│   ├── litematica/     # Litematica-related components
│   ├── profile/        # User profile components
│   └── admin/          # Admin panel components
├── pages/              # Nuxt pages (auto-routing)
├── layouts/            # Layout templates
├── middleware/         # Route middleware
├── plugins/            # Nuxt plugins
├── store/              # Pinia stores
├── utils/              # Utility functions
├── i18n/               # Internationalization files
├── assets/             # Static assets
├── public/             # Public static files
└── content/            # Content files (markdown)
```

### 🌍 Internationalization

The website supports multiple languages:
- **en**: English
- **zh_cn**: Chinese (Simplified)
- **zh_tw**: Chinese (Traditional)
- **ru**: Russian

Language files are located in the `i18n/` directory.

### 🤝 Contributing

We welcome contributions to improve Reden! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📄 License

This project is open source and available under the appropriate license.

### 🙏 Acknowledgments

- Minecraft community for inspiration
- Contributors and sponsors who make this project possible
- Open source libraries and tools used in this project

### 📞 Contact

- Discord: [Discord Server](https://discord.gg/fCxmEyFgAd)
- GitHub: [RedenMC Organization](https://github.com/RedenMC)
- Website: [redenmc.com](https://redenmc.com)

---

**Disclaimer**: This is not an official Minecraft service. Not approved by or associated with Mojang, NetEase or Microsoft.
