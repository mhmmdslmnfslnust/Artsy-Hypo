# 🎨 Bendscape - Interactive Art Generator

Bendscape is a sophisticated interactive art generator that creates beautiful patterns using bendable line segments. Built with Next.js, TypeScript, and HTML5 Canvas, it offers real-time parameter control and professional export capabilities.

## ✨ Features

### Core Drawing Engine
- **Flexible Length Control**: Fixed or random lengths within customizable ranges
- **Dynamic Angle System**: Fixed angles or random bending within specified ranges
- **Smart Stopping Conditions**: Distance-based, count-based, or exact return-to-start
- **Rich Color Palettes**: Fixed colors, random colors with pastel/bold/monochrome themes

### Interactive Interface
- **Real-time Controls**: Adjust parameters and see instant updates
- **Live Preview**: Canvas updates immediately as you change settings
- **Keyboard Shortcuts**: Quick access to common actions
- **Preset Management**: Save and load your favorite parameter combinations

### Export & Analysis
- **Multiple Formats**: PNG, SVG, and JSON export
- **Visual Annotations**: Show lengths and angles directly on artwork
- **Statistical Analysis**: View segment details, total length, and drawing metrics
- **Professional Quality**: High-resolution exports suitable for printing

## 🚀 Quick Start

### Installation

1. **Clone or download** this project
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open your browser** to `http://localhost:3000`

### First Steps

1. **Click "Generate"** to create your first pattern
2. **Experiment with parameters** in the left panel
3. **Use keyboard shortcuts** for quick actions:
   - `Ctrl+G` - Generate new pattern
   - `Ctrl+R` - Randomize all parameters
   - `Ctrl+C` - Clear canvas
   - `Ctrl+A` - Toggle annotations
   - `Esc` - Clear canvas

## 🎛️ Parameter Guide

### Length Settings
- **Fixed Mode**: All segments have the same length
- **Random Mode**: Each segment has a random length within your specified range

### Angle Settings
- **Fixed Mode**: Each turn uses the same angle (e.g., 45° for consistent right turns)
- **Random Mode**: Each turn uses a random angle within your range

### Color Settings
- **Fixed**: Single color for all segments
- **Random**: Different color for each segment
  - *Pastel*: Soft, muted colors
  - *Bold*: Bright, vibrant colors
  - *Monochrome*: Grayscale palette

### Stopping Conditions
- **Distance**: Stops when the drawing gets close to the starting point
- **Count**: Stops after a specific number of segments
- **Exact**: Stops when the line exactly returns to start (rare but beautiful)

## 🔧 Architecture

Bendscape uses clean, modular architecture with the Strategy pattern:

```
src/
├── types/           # TypeScript interfaces
├── lib/
│   ├── strategies.ts      # Strategy patterns for length, angle, color
│   ├── stopping-conditions.ts # Stopping condition strategies
│   ├── drawing-engine.ts  # Core drawing logic
│   └── utils.ts          # Export and preset utilities
├── components/
│   ├── Canvas.tsx        # HTML5 Canvas drawing component
│   ├── ControlPanel.tsx  # Parameter controls
│   └── ExportPanel.tsx   # Export and analysis tools
└── app/
    ├── layout.tsx        # App layout
    ├── page.tsx         # Main application
    └── globals.css      # Global styles
```

### Key Design Patterns

- **Strategy Pattern**: Interchangeable algorithms for length, angle, color, and stopping conditions
- **Observer Pattern**: React state management for real-time updates
- **Command Pattern**: Keyboard shortcuts and action handlers
- **Factory Pattern**: Preset creation and management

## 🎨 Creative Tips

### Geometric Patterns
- Use **fixed angles** (60°, 90°, 120°) with **random lengths** for geometric variety
- Try **distance stopping** with small values (10-20px) for closed shapes

### Organic Flows
- Use **random angles** (30°-60°) with **fixed lengths** for flowing, organic patterns
- **Count stopping** with high values (200-500) creates complex, dense patterns

### Minimal Art
- **Monochrome palette** with **fixed parameters** for clean, minimal aesthetics
- **Large fixed lengths** with **small angle ranges** for bold, simple forms

### Color Studies
- **Pastel palette** with **random parameters** for soft, dreamy artwork
- **Bold palette** with **geometric settings** for vibrant, structured pieces

## 🔄 Advanced Usage

### Custom Presets
1. Adjust parameters to your liking
2. Click "Save" in the Presets section
3. Name your preset for easy recall

### Export Workflow
1. Generate your artwork
2. Toggle annotations to see technical details
3. Export as:
   - **PNG**: For social media, presentations
   - **SVG**: For scalable graphics, further editing
   - **JSON**: For technical analysis, recreation

### Batch Generation
1. Set up your parameters
2. Use `Ctrl+G` repeatedly to generate variations
3. Export your favorites

## 🛠️ Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

The modular architecture makes it easy to extend:

1. **New Length Strategy**: Implement `LengthStrategy` interface
2. **New Color Mode**: Implement `ColorStrategy` interface
3. **New Stopping Condition**: Implement `StoppingCondition` interface
4. **New Export Format**: Add methods to `ExportUtils` class

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Canvas Support**: Required for drawing functionality
- **Local Storage**: Used for preset management
- **File Downloads**: Used for export functionality

## 🎯 Use Cases

- **Digital Art Creation**: Generate unique patterns for artwork
- **Educational Tools**: Teach geometry, angles, and mathematical patterns
- **Design Inspiration**: Create backgrounds, textures, and design elements
- **Algorithmic Art**: Explore generative art concepts
- **Relaxation**: Meditative pattern creation and exploration

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- New drawing strategies and algorithms
- Additional export formats (PDF, etc.)
- Animation and time-based generation
- Mobile touch interactions
- Advanced color algorithms
- Pattern symmetry tools

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Happy Creating!** 🎨✨
