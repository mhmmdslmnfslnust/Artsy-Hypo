# 🐛 KNOWN ISSUES & TODO LIST

## Issues to Fix:

### 1. **CSS/Tailwind Issues** 🎨
- Some controls may still have visibility issues
- Range sliders might not render properly in all browsers
- Tailwind CSS classes may not be fully applied
- Need to verify all form elements are visible and styled correctly

### 2. **Canvas Rendering** 🖼️
- Zoom and pan functionality needs testing across different browsers
- Canvas transformations may have edge cases
- Need to test with very large/small drawings
- Annotation positioning with zoom levels

### 3. **Export Functionality** 📤
- SVG export with zoom/pan transformations
- PNG export quality at different zoom levels
- JSON export validation
- File download compatibility across browsers

### 4. **UI/UX Improvements** ✨
- Mobile responsiveness needs work
- Touch gestures for zoom/pan on tablets
- Better error handling and user feedback
- Loading states for long-running operations

### 5. **Performance** ⚡
- Canvas redraw optimization
- Memory management for large drawings
- Debounced parameter updates
- Worker threads for complex calculations

### 6. **Browser Compatibility** 🌐
- Test in Safari, Firefox, Edge
- Canvas API compatibility
- File download methods
- Local storage functionality

### 7. **Feature Completeness** 🔧
- Gradient color mode implementation
- Animation/time-based generation
- Undo/redo functionality
- Pattern templates and examples

## Priority Order:
1. **HIGH**: Fix CSS visibility issues completely
2. **HIGH**: Test and fix zoom/pan functionality
3. **MEDIUM**: Export functionality validation
4. **MEDIUM**: Mobile responsiveness
5. **LOW**: Performance optimizations
6. **LOW**: Additional features

## Testing Checklist:
- [ ] All form controls visible in Chrome
- [ ] All form controls visible in Firefox
- [ ] All form controls visible in Safari
- [ ] Zoom in/out works smoothly
- [ ] Pan/drag works correctly
- [ ] PNG export works
- [ ] SVG export works
- [ ] JSON export works
- [ ] Preset save/load works
- [ ] Keyboard shortcuts work
- [ ] Mobile layout acceptable

## Notes:
- Simple Browser works better than complex debugging
- Focus on core functionality first
- Keep user experience smooth and intuitive
