# QA Checklist - Professional Hero Implementation

## Pre-Test Setup
- [ ] Install dependencies: `npm install @react-three/fiber @react-three/drei @react-three/postprocessing`
- [ ] Start development server: `npm start`
- [ ] Start dummy backend: `npm run dummy-server`
- [ ] Open DevTools Performance tab
- [ ] Test on Chrome, Firefox, Safari

## 🎯 Donut 3D Background Tests

### Visual Quality
- [ ] Central icosahedron object visible and rotating smoothly
- [ ] 28 objects orbiting in clear torus/donut pattern (desktop)
- [ ] Objects maintain consistent spacing and don't intersect
- [ ] Subtle bloom effect visible on neon objects
- [ ] Background doesn't interfere with UI readability

### Performance
- [ ] Idle frame rate ≥55 FPS on desktop
- [ ] Smooth rotation without stuttering
- [ ] Reduced mode triggers on mobile (8 objects max)
- [ ] Memory usage stable (no leaks after 5 minutes)
- [ ] CPU usage reasonable during animation

### Responsiveness
- [ ] Desktop: 28 objects, full bloom, parallax enabled
- [ ] Tablet: 20 objects, reduced bloom
- [ ] Mobile: 8 objects, no bloom, no parallax
- [ ] Automatic detection works correctly

## 🎛️ Advanced Input Pill Tests

### Floating Label Animation
- [ ] Placeholder visible when empty and unfocused
- [ ] On focus: placeholder fades out, label appears above
- [ ] Label animates smoothly (350ms transition)
- [ ] Label remains visible when input has content
- [ ] Animation reverses correctly when empty and unfocused

### Suggestions System
- [ ] Suggestions appear when typing (after 1+ characters)
- [ ] Arrow Down/Up navigate suggestions correctly
- [ ] Selected suggestion highlighted visually
- [ ] Enter key selects highlighted suggestion
- [ ] Escape key closes suggestions
- [ ] Click on suggestion works
- [ ] Suggestions filter based on input text

### Voice Input
- [ ] Microphone button visible when supported
- [ ] Button shows "not supported" state gracefully
- [ ] Click starts voice recognition (permission prompt)
- [ ] Listening state indicated visually (pulsing animation)
- [ ] Speech transcript populates input field
- [ ] Voice input stops automatically after speech
- [ ] Manual stop button works during listening

### Presets System
- [ ] Preset button (📋) opens dropdown
- [ ] 5 preset templates visible
- [ ] Click on preset fills input field
- [ ] Dropdown closes after selection
- [ ] Keyboard navigation works in presets

### Progress & Generation
- [ ] Generate button disabled when input empty
- [ ] Progress bar appears during generation
- [ ] Progress animates from 0% to ~95%
- [ ] Cancel button (✕) appears during generation
- [ ] Cancel stops generation and resets state
- [ ] Success state completes progress to 100%

## 🎨 Below-Hero Section Tests

### Layout & Responsiveness
- [ ] Desktop: 3-column layout (preview | content | CTA)
- [ ] Tablet: Stacked layout, centered alignment
- [ ] Mobile: Single column, proper spacing
- [ ] All elements visible and accessible

### Mini Preview Canvas
- [ ] 180px square canvas renders 3D object
- [ ] Object rotates continuously
- [ ] Click opens full preview modal (placeholder)
- [ ] Hover effect (lift + glow) works
- [ ] "Live Preview" label visible below

### Feature Chips
- [ ] 3 chips visible: AI-Powered, Real-time Preview, Export Ready
- [ ] Hover shows tooltip with description
- [ ] Tooltip positioned correctly (above chip)
- [ ] Tooltip fades in/out smoothly
- [ ] Icon animation on hover (scale + rotate)
- [ ] Click handler works (console log)

### CTA Cluster
- [ ] Primary button: "Generate" with gradient background
- [ ] Secondary button: "Choose Template" with magenta accent
- [ ] Tertiary button: "Upload Reference" with subtle styling
- [ ] Hover effects work on all buttons
- [ ] Generate button shows spinner when loading
- [ ] Disabled states work correctly

### Template Carousel
- [ ] 5 template thumbnails visible
- [ ] Previous/Next buttons functional
- [ ] Hover on thumbnail shows preview in mini-canvas
- [ ] Click on thumbnail selects template
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Carousel wraps around at ends

## ♿ Accessibility Tests

### Keyboard Navigation
- [ ] Tab order: Input → Presets → Voice → Generate → Feature chips → CTA buttons → Templates
- [ ] All interactive elements reachable via keyboard
- [ ] Focus indicators visible (2px cyan outline)
- [ ] Enter/Space activate buttons correctly
- [ ] Arrow keys work in suggestions and carousel
- [ ] Escape closes dropdowns

### Screen Reader Testing
- [ ] Input has proper aria-label
- [ ] Floating label linked via aria-describedby
- [ ] Suggestions have role="listbox" and aria-selected
- [ ] Progress announced via aria-live region
- [ ] Feature chips have descriptive labels
- [ ] Template thumbnails have meaningful alt text
- [ ] Generation status changes announced

### ARIA Attributes
- [ ] Input: aria-label, aria-describedby, aria-expanded
- [ ] Buttons: aria-label for icon-only buttons
- [ ] Dropdowns: role="listbox", aria-selected
- [ ] Progress: role="progressbar", aria-valuenow
- [ ] Live regions: aria-live="polite"

### Focus Management
- [ ] Focus trapped in dropdowns when open
- [ ] Focus returns to trigger after dropdown closes
- [ ] Focus visible on all interactive elements
- [ ] Focus not lost during dynamic content changes
- [ ] Skip links work if implemented

## 🎭 Motion & Animation Tests

### Reduced Motion Support
- [ ] `prefers-reduced-motion: reduce` detected
- [ ] Continuous animations stop (donut rotation)
- [ ] Transition durations reduced to 0.01ms
- [ ] Essential animations preserved (focus indicators)
- [ ] No motion sickness triggers

### Animation Quality
- [ ] All transitions smooth (no jank)
- [ ] Easing curves feel natural
- [ ] No layout thrashing during animations
- [ ] Transform and opacity used (not layout properties)
- [ ] 60fps maintained during interactions

## 📱 Cross-Platform Tests

### Desktop (≥1024px)
- [ ] Full 3-column layout
- [ ] 28 orbiting objects
- [ ] Parallax cursor effect works
- [ ] All features enabled
- [ ] Performance targets met

### Tablet (768-1023px)
- [ ] Stacked layout
- [ ] 20 orbiting objects
- [ ] Reduced bloom effect
- [ ] Touch interactions work
- [ ] Readable text sizes

### Mobile (<768px)
- [ ] Single column layout
- [ ] 8 orbiting objects maximum
- [ ] No parallax effect
- [ ] Touch targets ≥44px
- [ ] Simplified animations
- [ ] Readable on small screens

## 🌐 Browser Compatibility

### Chrome 90+
- [ ] All features work perfectly
- [ ] WebGL renders correctly
- [ ] Voice API supported
- [ ] Performance optimal

### Firefox 88+
- [ ] WebGL compatibility confirmed
- [ ] Voice API fallback works
- [ ] CSS backdrop-filter supported
- [ ] Acceptable performance

### Safari 14+
- [ ] WebGL limitations handled
- [ ] iOS touch events work
- [ ] Voice API fallback graceful
- [ ] Mobile performance acceptable

### Edge 90+
- [ ] Feature parity with Chrome
- [ ] No rendering issues
- [ ] Performance comparable

## 🔧 Performance Benchmarks

### Frame Rate Tests
- [ ] Desktop idle: ≥55 FPS
- [ ] Desktop with interactions: ≥45 FPS
- [ ] Mobile reduced mode: ≥30 FPS
- [ ] No dropped frames during UI interactions

### Memory Usage
- [ ] Initial load: <50MB
- [ ] After 5 minutes: <100MB
- [ ] No memory leaks detected
- [ ] Garbage collection working

### Network Performance
- [ ] Initial bundle: <2MB
- [ ] Time to interactive: <3s
- [ ] First contentful paint: <1.5s
- [ ] Lighthouse score: ≥90

## 🚨 Error Handling

### Network Errors
- [ ] Backend unavailable handled gracefully
- [ ] Error notifications appear
- [ ] User can retry operations
- [ ] No console errors

### WebGL Errors
- [ ] WebGL context loss handled
- [ ] Fallback to reduced mode works
- [ ] Error messages user-friendly
- [ ] App remains functional

### Input Validation
- [ ] Empty input handled
- [ ] Maximum length enforced (500 chars)
- [ ] Special characters accepted
- [ ] XSS prevention in place

## 📊 Final Acceptance

### Must Pass (Blocking)
- [ ] Donut rotation smooth and visually centered
- [ ] Input pill floating label works perfectly
- [ ] Voice input functional with fallback
- [ ] Below-hero section fully responsive
- [ ] All accessibility requirements met
- [ ] Performance targets achieved
- [ ] Cross-browser compatibility confirmed

### Should Pass (Quality)
- [ ] Visual polish and attention to detail
- [ ] Smooth micro-interactions
- [ ] Consistent design system
- [ ] Professional appearance
- [ ] Intuitive user experience

## 📝 Test Results

**Tested by:** ________________  
**Date:** ________________  
**Browser/OS:** ________________  
**Device:** ________________  

### Performance Metrics
- **Desktop FPS:** _____ (target: ≥55)
- **Mobile FPS:** _____ (target: ≥30)
- **Bundle Size:** _____ (target: <2MB)
- **Load Time:** _____ (target: <3s)

### Accessibility Score
- **Keyboard Navigation:** ☐ Pass ☐ Fail
- **Screen Reader:** ☐ Pass ☐ Fail  
- **ARIA Compliance:** ☐ Pass ☐ Fail
- **Focus Management:** ☐ Pass ☐ Fail

### Overall Status
☐ **PASS** - Ready for production  
☐ **CONDITIONAL** - Minor issues to address  
☐ **FAIL** - Major issues require fixes  

### Notes & Issues
_________________________________
_________________________________
_________________________________
_________________________________

### Recommendations
_________________________________
_________________________________
_________________________________
_________________________________