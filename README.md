# xlam HUB

A modern, W3C-compliant script repository with TypeScript support and cache busting for GitHub Pages deployment.

## Features

- **W3C Compliant**: Fully validated HTML5 with proper semantic structure
- **TypeScript**: Modern JavaScript with type safety and better development experience
- **Cache Busting**: Automatic cache invalidation for GitHub Pages deployment
- **PWA Support**: Progressive Web App capabilities with manifest and service worker
- **GPU Acceleration**: Optimized animations and performance monitoring
- **Responsive Design**: Mobile-first approach with cross-browser compatibility
- **Search Functionality**: Real-time script search with filtering
- **Modal System**: Interactive script previews and details

## File Structure

```
website/
├── index.html              # Main HTML file (W3C compliant)
├── styles.css              # External CSS with all styles
├── app.ts                  # TypeScript source code
├── app.js                  # Compiled JavaScript (generated)
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── manifest.json           # PWA manifest
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
└── README.md               # This file
```

## W3C Compliance

The website is fully W3C compliant with:

- Proper HTML5 semantic structure
- Valid CSS3 with vendor prefixes
- Accessible markup and ARIA attributes
- Cross-browser compatibility
- Mobile responsiveness
- Performance optimizations

## TypeScript Implementation

The application uses TypeScript for:

- Type-safe JavaScript development
- Better IDE support and autocomplete
- Compile-time error checking
- Modern ES2020 features
- Modular code organization

## Cache Busting Strategy

Cache busting is implemented through:

1. **Build-time timestamp generation** in GitHub Actions
2. **Placeholder replacement** in static files
3. **Version query parameters** for all assets
4. **Automatic cache invalidation** on deployment

## Deployment

### Local Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### GitHub Pages Deployment

1. Push to `main` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Builds TypeScript
   - Generates cache busting timestamps
   - Deploys to GitHub Pages

### Manual Deployment

```bash
# Build and deploy
npm run deploy
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **GPU Acceleration**: Hardware-accelerated animations
- **Intersection Observer**: Lazy loading and performance optimization
- **CSS Containment**: Layout and paint isolation
- **Will-change**: Strategic GPU layer promotion
- **Performance Monitoring**: Real-time metrics and debugging

## Script Categories

- **Auto Farm**: Automated farming scripts
- **Pet Spawner**: Visual and serverside pet spawning
- **Trade Tools**: Value checking and bypass scripts
- **Performance**: FPS boost and graphics enhancement
- **Exploits**: Various game mechanics exploits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure W3C compliance
5. Test thoroughly
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the FAQ section
- Review the documentation

## Changelog

### v1.0.0
- Initial release
- W3C compliance implementation
- TypeScript conversion
- Cache busting system
- GitHub Pages deployment 