# Jazz à Saint Sat - Festival Website

A beautiful showcase website for the Jazz festival in Saint Saturnin, France, featuring an interactive progressive zoom experience.

## Features

- **Interactive Map Navigation**: Click through a progressive zoom from France → Region → Festival details
- **Smooth Animations**: Beautiful transitions and hover effects
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Navigation**: Use arrow keys, Enter, or Escape to navigate
- **Modern Design**: Clean, elegant interface with a gradient background and glassmorphism effects

## How to Use

1. **Start**: Open `index.html` in your web browser
2. **Navigation**:
   - Click on the France map to zoom into the region
   - Click on the region map to see the festival details
   - Use the back buttons or keyboard navigation to return to previous stages
3. **Keyboard Controls**:
   - **Right Arrow / Enter / Space**: Go to next stage
   - **Left Arrow / Escape**: Go to previous stage

## File Structure

```
JazzSaintSat/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Interactive functionality
└── README.md           # This file
```

## Technical Details

### HTML Structure

- Three main stages: France map, Region map, and Festival presentation
- Semantic HTML5 elements for accessibility
- SVG graphics for scalable map illustrations

### CSS Features

- CSS Grid and Flexbox for responsive layouts
- Custom animations using CSS keyframes
- Glassmorphism effects with backdrop-filter
- Smooth transitions with cubic-bezier curves
- Mobile-first responsive design

### JavaScript Functionality

- Stage management system
- Smooth transitions between views
- Keyboard navigation support
- Hover effects and animations
- Performance optimizations (image preloading)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Customization

### Updating Festival Information

Edit the content in `index.html` within the `#stage3` section:

- Festival dates
- Location details
- Description text
- Call-to-action buttons

### Styling Changes

Modify `style.css` to customize:

- Colors and gradients
- Typography
- Animation timings
- Layout adjustments

### Adding Features

The JavaScript is modular and can be extended:

- Add more stages
- Include additional animations
- Integrate with booking systems
- Add audio/video elements

## Performance

- Lightweight: < 50KB total file size
- Fast loading with optimized images
- Smooth 60fps animations
- Efficient DOM manipulation

## Development Notes

- The website uses modern CSS features (backdrop-filter, CSS Grid)
- No external dependencies beyond Google Fonts
- Vanilla JavaScript for maximum compatibility
- Optimized for both touch and mouse interactions

## Future Enhancements

- Add actual booking system integration
- Include video backgrounds
- Add multi-language support
- Integrate with social media APIs
- Add event calendar functionality

---

**Created for the Jazz à Saint Sat festival - Celebrating jazz music in the heart of Auvergne, France**
