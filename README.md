# 🚀 3D Design Generator

A cutting-edge, futuristic 3D design generation platform built with React, Three.js, and Express.js. Features an immersive sci-fi interface with orbiting geometric shapes, real-time design generation, and smooth animations.

![Futuristic UI](https://img.shields.io/badge/UI-Futuristic-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-r180-green?style=for-the-badge)
![Express](https://img.shields.io/badge/Express-4.18.2-black?style=for-the-badge)

## ✨ Features

### 🎨 **Immersive 3D Environment**
- **70+ orbiting geometric shapes** across 7 layered orbits
- **9 different 3D geometries**: Cube, Sphere, Cylinder, Cone, Torus, Octahedron, Tetrahedron, Dodecahedron, Icosahedron
- **Interactive central object** with mouse-responsive rotation
- **Futuristic color palette**: Cyan, Magenta, and Yellow gradients with glow effects

### 🎯 **Design Generation**
- **AI-powered design creation** from natural language prompts
- **Real-time 3D visualization** of generated designs
- **Component-based architecture** with detailed specifications
- **Multiple design types**: Furniture, lighting, and custom objects

### 🎪 **Advanced UI/UX**
- **Smooth animations** and transitions throughout
- **Glass morphism effects** with backdrop blur
- **Responsive navigation** with animated hamburger menu
- **Interactive feedback** with loading states and error handling

### 🔧 **Technical Excellence**
- **Performance optimized** with React.useMemo and proper dependency management
- **TypeScript-ready architecture** with clean component structure
- **Comprehensive testing** with Jest and React Testing Library
- **ESLint compliant** with zero critical warnings

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-final-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm run server
   ```
   Backend will run on `http://localhost:3001`

4. **Start the frontend** (in a new terminal)
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3002`

5. **Open your browser** and navigate to `http://localhost:3002`

## 📡 API Documentation

### Backend Endpoints

#### `POST /generate`
Generate a 3D design from a text prompt.

**Request:**
```json
{
  "prompt": "A modern wooden chair"
}
```

**Response:**
```json
{
  "type": "chair",
  "style": "modern",
  "material": "wood",
  "dimensions": {
    "width": 50,
    "height": 80,
    "depth": 45
  },
  "components": [...],
  "colors": {...}
}
```

#### `POST /evaluate`
Rate a generated design.

**Request:**
```json
{
  "designId": "123",
  "rating": 5
}
```

#### `POST /iterate`
Create an improved version of a design.

**Request:**
```json
{
  "designId": "123",
  "feedback": "Make it more ergonomic"
}
```

#### `GET /stub/generate`
Get stub asset data for 3D models and textures.

## 🎮 Usage

### Creating Designs
1. **Enter a prompt** in the input field (e.g., "A minimalist stool", "A dining table for 4 people")
2. **Click Generate** or press Enter
3. **View the 3D result** in the preview area
4. **Explore the JSON specification** in the viewer panel

### Navigation
- **Hamburger menu** (top-left) for navigation options
- **Home**: Return to design input
- **About**: Project information
- **Help**: Usage instructions

### Interactive Features
- **Mouse movement** affects the central 3D object's rotation
- **Orbiting shapes** create dynamic background animation
- **Smooth transitions** between all interface states

## 🛠️ Development

### Available Scripts

```bash
# Start frontend development server
npm start

# Start backend API server
npm run server

# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (irreversible)
npm run eject
```

### Project Structure

```
my-final-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── App.js         # Main application component
│   │   ├── InteractiveCubeBackground.js  # 3D background system
│   │   └── ...
│   ├── App.css            # Main styles
│   ├── index.js           # Application entry point
│   └── setupTests.js      # Test configuration
├── server.js              # Express.js backend server
├── craco.config.js        # Build configuration override
└── package.json           # Dependencies and scripts
```

### Key Technologies

- **Frontend**: React 19, Three.js, React Three Fiber, React Three Drei
- **Backend**: Node.js, Express.js, CORS
- **Styling**: CSS3 with glass morphism effects
- **Build**: Create React App with CRACO overrides
- **Testing**: Jest, React Testing Library

## 🎨 Design Philosophy

### Futuristic Aesthetics
- **Neon color palette** with cyan, magenta, and yellow accents
- **Glass morphism** with backdrop blur and transparency
- **Geometric precision** in both UI and 3D elements
- **Smooth animations** for all state transitions

### User Experience
- **Intuitive workflow** from prompt to 3D visualization
- **Immediate feedback** with loading states and animations
- **Accessible navigation** with clear visual hierarchy
- **Responsive design** that works on all screen sizes

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Disable source maps for cleaner builds
GENERATE_SOURCEMAP=false

# Backend API URL (if different from localhost:3001)
REACT_APP_API_URL=http://localhost:3001
```

### Build Configuration
The project uses CRACO to override Create React App's webpack configuration for:
- Suppressing source map warnings
- Custom webpack rules for Three.js optimization

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage
- **Component rendering** and user interactions
- **API integration** and error handling
- **Animation and transition** behaviors
- **Responsive design** across breakpoints

## 🚢 Deployment

### Frontend Deployment
```bash
npm run build
```
Deploy the `build` folder to your hosting service (Netlify, Vercel, etc.).

### Backend Deployment
Deploy the Express server to Heroku, Railway, or any Node.js hosting platform.

### Environment Setup
Ensure both frontend and backend are configured with the correct API endpoints for production.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Three Fiber** for seamless React-Three.js integration
- **React Three Drei** for comprehensive 3D utilities
- **Create React App** for the solid foundation
- **Express.js** for the reliable backend framework

## 📞 Support

For questions, issues, or contributions:
- **GitHub Issues**: Report bugs and request features
- **Pull Requests**: Submit improvements and fixes
- **Discussions**: Share ideas and get help

---

**Experience the future of 3D design generation** 🚀✨
